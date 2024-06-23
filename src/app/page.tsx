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

export default function Home() {
  // These don't change as a game is progressing
  const [game, setGame] = useState<Game>(() => new Game())
  const [newGame, setNewGame] = useState<Game | null>(null)
  const [isHardcoreModeEnabled, setIsHardcoreModeEnabled] = useState(true)
  const [isOngoingHintsModeEnabled, setIsOngoingHintsModeEnabled] = useState(false)
  // TODO: this renders multiple times. The hack is to set the index explicitly so it's idemptotent
  const [sudoku, setSudoku] = useState<Sudoku>(() => getSudoku({ difficulty: game.difficulty, index: 4 }))
  const [itemLocations, setItemLocations] = useState<[string, number, number][]>([])

  // These do change as a game is progressing
  const [mistakes, setMistakes] = useState<[number, number, CellValue][]>([])
  const [isRevealMistakes, setIsRevealMistakes] = useState(false)
  const [hint, setHint] = useState<[number, number, CellValue] | null>(null)
  const [selectedCell, setSelectedCell] = useState<[number, number]>([0, 0])
  const [items, setItems] = useState(() => initItems(isHardcoreModeEnabled, isOngoingHintsModeEnabled))
  const [notes, setNotes] = useState(() => initNotes())
  const [enabledItem, setEnabledItem] = useState<string>()

  useEffect(() => {
    setItems(initItems(isHardcoreModeEnabled, isOngoingHintsModeEnabled))
  }, [isHardcoreModeEnabled, isOngoingHintsModeEnabled])

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
              itemLocations={isHardcoreModeEnabled ? itemLocations : []}
              gameover={gameover}
              hasLives={isHardcoreModeEnabled}
              notes={notes}
              toggleNoteValue={enabledItem === '✏️' ? toggleNoteValue : undefined}
            />
          </div>
          <Toolbox putValueInCell={putValueInCell} />
          <HintPanel
            isFoundMistakes={isOngoingHintsModeEnabled ? false : mistakes.length > 0}
            isFoundHint={!!hint}
            useItem={useItem}
            isOngoingHintsModeEnabled={isOngoingHintsModeEnabled}
            isHardcoreModeEnabled={isHardcoreModeEnabled}
            items={items}
            enabledItem={enabledItem}
            chooseEnabledItem={chooseEnabledItem}
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

  function gameover() {
    setGame(g => g.fail())
  }

  function updateSudoku(value: CellValue, row: number, col: number) {
    // Interesting scenario to fix here
    // setSudoku depends on the current sudoku state, so it should use setSudoku(prevSudoku => { prevSudoku.updateCell(...)})
    // but all the other states (e.g. setHint, setMistakes, etc) also depend on new Sudoku
    // can these all go inside the setSukoku callback?
    // Or does this point towards a design problem?
    const newSudoku = sudoku.updateCell(value, row, col)

    if (newSudoku.isSolved()) {
      setSudoku(newSudoku)
      return setGame(game => game.complete())
    }

    setGame(game => game.start())

    if (isOngoingHintsModeEnabled) {
      if (mistakes.length === 0) {
        setSudoku(newSudoku)
        return
      }
      setMistakes(mistakes)
      setIsRevealMistakes(true)
      setHint(newSudoku.getHint({ allowMistakes: true }))
      return
    }
    if (isHardcoreModeEnabled) {
      const mistakes = newSudoku.findMistakes()
      if (mistakes.length === 0) {
        setSudoku(newSudoku)
        const itemLocation = itemLocations.find(el => el[1] === row && el[2] === col)
        if (value && itemLocation) {
          setItems(i => [...new Set([...i, itemLocation[0]])])
        }
        return
      }
      setMistakes(newSudoku.findMistakes())
      setIsRevealMistakes(true)
      return
    }
    setSudoku(newSudoku)
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
    setIsRevealMistakes(true)
  }

  function getHint() {
    try {
      setHint(sudoku.getHint())
    } catch (err: unknown) {
      if (err instanceof MistakeError) {
        setMistakes(err.mistakes)
      }
    }
  }

  function revealHint() {
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
    if (enabledItem === '✏️') {
      toggleNoteValue(selectedCell[0], selectedCell[1], value)
    } else {
      updateSudoku(value, selectedCell[0], selectedCell[1])
    }
  }

  function toggleNoteValue(row: number, col: number, noteValue: CellValue) {
    if (notes[row][col].has(noteValue)) {
      notes[row][col].delete(noteValue)
    } else {
      notes[row][col].add(noteValue)
    }
    setNotes([...notes])
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

    const itemsToDistribute = ['🛡️', '🪄', '🔮', '🔦', '☀️', '🌱', '❄️', '🚒', '🧀', '🖐️']
    const itemLocations: [string, number, number][] = []
    for (let i = 0; i < itemsToDistribute.length; i++) {
      const locationIndex = Math.floor(Math.random() * availableLocations.length)
      const location = availableLocations[locationIndex]
      itemLocations.push([itemsToDistribute[i], location[0], location[1]])
      availableLocations.splice(locationIndex, 1)
    }

    const negativeEffectsToDistribute = ['🗡️', '🔥', '🐢', '🌋', '🔦', '🪞', '🐀', '😵‍💫']
    return itemLocations
  }

  function initItems(isHardcoreModeEnabled: boolean, isOngoingHintsModeEnabled: boolean): string[] {
    if (isHardcoreModeEnabled) {
      return ['✏️', '🧯']
    }
    if (isOngoingHintsModeEnabled) {
      return ['✏️', '🗑️', '🍼', '🏳️']
    }
    return ['✏️', '🔍', '🏳️']
  }

  function chooseEnabledItem(item: string) {
    setEnabledItem(i => {
      if (item === i) {
        return undefined
      }
      return item
    })
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
      default:
        return alert('Not implemented yet')
    }
  }

  function initNotes(): Set<CellValue>[][] {
    return Array.from(
      { length: 9 }, _r => Array.from(
        { length: 9 }, _c => new Set<CellValue>([])
      )
    )
  }
}
