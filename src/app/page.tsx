'use client'

import { EndGameError } from "@/errors/endGame";
import { Game, GameDifficulty, GameState } from "@/models/game";
import { CellType, CellValue, Sudoku } from "@/models/sudoku";
import { getSudoku } from "@/services/sudokuService";
import { useEffect, useState, useReducer } from "react";
import { MistakeError } from "../errors/mistake";
import DifficultySelector from "./sudoku/difficultySelector";
import HintPanel from "./sudoku/hintPanel";
import OptionsSelector from "./sudoku/optionsSelector";
import Sudoku9x9Grid from "./sudoku/sudoku-grid/sudokuGrid";
import Title from "./sudoku/title";
import Toolbox from "./sudoku/toolbox";

interface SudokuAndItemLocations {
  sudoku: Sudoku
  itemLocations: [string, number, number][]
}
export default function Home() {
  // Game states
  const [game, setGame] = useState<Game>(() => new Game())
  const [newGame, setNewGame] = useState<Game | null>(null)
  const [isHardcoreModeEnabled, setIsHardcoreModeEnabled] = useState(true)
  const [isOngoingHintsModeEnabled, setIsOngoingHintsModeEnabled] = useState(false)

  // Sudoku states
  const [sudoku, setSudoku] = useState<Sudoku>(() => getSudoku({ difficulty: game.difficulty, index: 4 }))
  const [itemLocations, setItemLocations] = useState<[string, number, number][]>([])

  const [mistakes, setMistakes] = useState<[number, number, CellValue][]>([])
  const [isRevealMistakes, setIsRevealMistakes] = useState(false)
  const [hint, setHint] = useState<[number, number, CellValue] | null>(null)
  const [selectedCell, setSelectedCell] = useState<[number, number]>([0, 0])

  useEffect(() => {
    if (sudoku && itemLocations.length === 0) {
      setItemLocations(determineItemLocations(sudoku))
    }
  }, [sudoku])

  useEffect(() => {
    if (!newGame) {
      return
    }

    setGame(g => {
      try {
        const nGame = g.newGame(newGame.difficulty)
        reset(nGame)
        return nGame
      } catch (e: unknown) {
        if (!(e instanceof EndGameError)) {
          return g
        }
        if (!confirm(e.message)) { // TODO: this is broken
          return g
        }
        reset(e.game)
        return e.game
      }
    })
  }, [newGame])

  return (
    <div className="w-full h-full	flex flex-row justify-center bg-yellow-50 h-svh">
      <div className="bg-white w-full max-w-2xl">
        <div className='h-screen flex flex-col justify-evenly my-0 mx-5 h-svh'>
          <Title isHardcoreModeEnabled={isHardcoreModeEnabled} isOngoingHintsModeEnabled={isOngoingHintsModeEnabled}/>
          <DifficultySelector requestNewGame={requestNewGame} difficulty={game.difficulty} />
          <OptionsSelector
            enableOngoingHintsMode={enableOngoingHintsMode}
            enableHardcoreMode={setIsHardcoreModeEnabled}
            isHardcoreModeEnabled={isHardcoreModeEnabled}
            isOngoingHintsModeEnabled={isOngoingHintsModeEnabled}
          />
          <div className='flex flex-col justify-center items-center'>
            <Sudoku9x9Grid
              selectedCell={selectedCell}
              selectCell={selectCell}
              sudoku={sudoku}
              updateSudoku={updateSudoku}
              hint={hint}
              mistakes={isRevealMistakes ? mistakes : []}
              isHardcoreModeEnabled={isHardcoreModeEnabled}
              isOngoingHintsModeEnabled={isOngoingHintsModeEnabled}
              itemLocations={itemLocations}
            />
          </div>
          <Toolbox putValueInCell={putValueInCell} />
          <HintPanel
            isFoundMistakes={isOngoingHintsModeEnabled ? false : mistakes.length > 0}
            isFoundHint={!!hint}
            useItem={useItem}
            isHardcoreModeEnabled={isHardcoreModeEnabled}
            isOngoingHintsModeEnabled={isOngoingHintsModeEnabled}
          />
        </div>
      </div>
    </div>
  )

  function requestNewGame(difficulty: GameDifficulty) {
    setNewGame(new Game(difficulty))
  }

  function reset(newGame: Game) {
    const newSudoku = getSudoku({ difficulty: newGame.difficulty })
    setNewGame(null)
    setSudoku(newSudoku)
    setMistakes([])
    setHint(null)
    setSelectedCell([0, 0])
    setItemLocations(determineItemLocations(newSudoku))
  }

  function updateSudoku(value: CellValue, row: number, col: number) {
    if (![GameState.Intial, GameState.InProgress].includes(game.state)) {
      return
    }
    // Interesting scenario to fix here
    // setSudoku depends on the current sudoku state, so it should use setSudoku(prevSudoku => { prevSudoku.updateCell(...)})
    // but all the other states (e.g. setHint, setMistakes, etc) also depend on new Sudoku
    // can these all go inside the setSukoku callback?
    // Or does this point towards a design problem?
    const newSudoku = sudoku.updateCell(value, row, col)
    setSudoku(newSudoku)

    if (newSudoku.isSolved()) {
      return setGame(game => game.complete())
    }

    setGame(game => game.start())

    if (isOngoingHintsModeEnabled) {
      setMistakes(newSudoku.findMistakes())
      setIsRevealMistakes(true)
      setHint(newSudoku.getHint({ allowMistakes: true }))
      return
    }
    setHint(prevHint => {
      if (prevHint && prevHint[0] === row && prevHint[1] === col) {
        return null
      }
      return prevHint
    })
    setMistakes(prevMistakes => {
      if (prevMistakes.map(m => `${m[0]}${m[1]}`).includes(`${row}${col}`)) {
        const newMistakes = prevMistakes.filter(m => m[0] !== row || m[1] !== col)

        if (newMistakes.length === 0) {
          setIsRevealMistakes(false)
        }
        return newMistakes
      }
      return prevMistakes
    })
  }

  function revealMistakes() {
    if (![GameState.Intial, GameState.InProgress].includes(game.state)) {
      return
    }
    setIsRevealMistakes(true)
  }

  function getHint() {
    if (![GameState.Intial, GameState.InProgress].includes(game.state)) {
      return
    }
    try {
      setHint(sudoku.getHint())
    } catch (err: unknown) {
      if (err instanceof MistakeError) {
        setMistakes(err.mistakes)
      }
    }
  }

  function revealHint() {
    if (![GameState.Intial, GameState.InProgress].includes(game.state)) {
      return
    }
    const revealedHint = sudoku.revealHint()
    const newSudoku = sudoku.updateCell(revealedHint[2], revealedHint[0], revealedHint[1])
    setSudoku(newSudoku)
    setGame(game => game.start())

    if (isOngoingHintsModeEnabled) {
      setMistakes(newSudoku.findMistakes())
      setHint(newSudoku.getHint({ allowMistakes: true }))
      return
    }

    setHint(null)
  }

  function solveSudoku() {
    setSudoku(sudoku.getSolution())
    setMistakes([])
    setIsOngoingHintsModeEnabled(false)
    setIsRevealMistakes(false)
    setHint(null)
  }

  function enableOngoingHintsMode(isEnable: boolean) {
    if (![GameState.Intial, GameState.InProgress].includes(game.state)) {
      return
    }
    setIsOngoingHintsModeEnabled(isEnable)

    if (!isEnable) {
      setHint(null)
      setMistakes([])
      setIsRevealMistakes(false)
      return
    }

    setMistakes(sudoku.findMistakes())
    setHint(sudoku.getHint({ allowMistakes: true }))
    setIsRevealMistakes(true)
  }

  function selectCell(cell: [number, number]) {
    setSelectedCell(cell)
  }

  function putValueInCell(value: CellValue) {
    updateSudoku(value, selectedCell[0], selectedCell[1])
  }

  function determineItemLocations(sudoku: Sudoku): [string, number, number][] {
    if (!sudoku) return []
    const availableLocations: [number, number][] = []
    const cells = sudoku.getCells()
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (cells[r][c].cellType === CellType.Variable) {
          availableLocations.push([r, c])
        }
      }
    }

    const itemsToDistribute = ['🛡️', '🪄', '🔮', '🔦', '☀️', '🌱', '❄️']
    const itemLocations: [string, number, number][] = []
    for (let i = 0; i < itemsToDistribute.length; i++) {
      const locationIndex = Math.floor(Math.random() * availableLocations.length)
      const location = availableLocations[locationIndex]
      itemLocations.push([itemsToDistribute[i], location[0], location[1]])
      availableLocations.splice(locationIndex, 1)
    }
    return itemLocations
  }

  function useItem(value: string) {
    switch (value) {
      case '🗑️': return updateSudoku(null, selectedCell[0], selectedCell[1])
      case '🔍': {
        if (mistakes.length > 0) {
          return revealMistakes()
        }
        if (hint) {
          return revealHint()
        }
      }
        return getHint()
      case '🍼':
        return revealHint()
      case '🏳️': return solveSudoku()
      case '✏️':
      case '🧯': 
      case '🪄':
      case '🔮':
      case '🔦':
      case '☀️':
        return alert('Not implemented yet')
    }
  }
}
