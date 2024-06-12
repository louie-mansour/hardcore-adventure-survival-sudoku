'use client'

import { EndGameError } from "@/errors/endGame";
import { Game, GameDifficulty, GameState } from "@/models/game";
import { CellValue, Sudoku } from "@/models/sudoku";
import { getSudoku } from "@/services/sudokuService";
import { useEffect, useState } from "react";
import { MistakeError } from "../errors/mistake";
import DifficultySelector from "./sudoku/difficultySelector";
import HintPanel from "./sudoku/hintPanel";
import OptionsSelector from "./sudoku/optionsSelector";
import Sudoku9x9Grid from "./sudoku/sudoku-grid/sudokuGrid";
import Title from "./sudoku/title";
import Toolbox from "./sudoku/toolbox";


export default function Home() {
  // Game states
  const [game, setGame] = useState<Game>(new Game())
  const [newGame, setNewGame] = useState<Game | null>(null)
  const [isHardcoreModeEnabled, setIsHardcoreModeEnabled] = useState(false)
  const [isOngoingHintsModeEnabled, setIsOngoingHintsModeEnabled] = useState(false)

  // Sudoku states
  const [sudoku, setSudoku] = useState<Sudoku>(getSudoku({ difficulty: game.difficulty, index: 4 }))
  const [mistakes, setMistakes] = useState<[number, number, CellValue][]>([])
  const [isRevealMistakes, setIsRevealMistakes] = useState(false)
  const [hint, setHint] = useState<[number, number, CellValue] | null>(null)
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (!newGame) {
      return
    }

    try {
      setGame(game => game.newGame(newGame.difficulty))
    } catch (e: unknown) {
      if (e instanceof EndGameError) {
        const isConfirmGetNewGame = confirm(e.message)
        if (!isConfirmGetNewGame) {
          setGame(e.game)
        }
      } else {
        throw e
      }
    }

    setNewGame(null)
    setSudoku(getSudoku({ difficulty: newGame.difficulty }))
    setMistakes([])
    setHint(null)
    setSelectedCell(null)
    setIsOngoingHintsModeEnabled(false)
  }, [newGame, game.state])

  return (
    <div className="w-full h-screen	flex flex-row justify-center bg-yellow-50">
      <div className="bg-white w-full max-w-2xl">
        <div className='h-full flex flex-col justify-evenly my-0 mx-16'>
          <Title />
          <DifficultySelector requestNewGame={requestNewGame} difficulty={game.difficulty} />
          <OptionsSelector
            enableOngoingHintsMode={enableOngoingHintsMode}
            enableHardcoreMode={setIsHardcoreModeEnabled}
            isHardCodeModeEnabled={isHardcoreModeEnabled}
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
            />
          </div>
          <Toolbox putValueInCell={putValueInCell}/>
          <HintPanel
            checkForMistakes={checkForMistakes}
            revealMistakes={revealMistakes}
            isFoundMistakes={isOngoingHintsModeEnabled ? false : mistakes.length > 0}
            getHint={getHint}
            revealHint={revealHint}
            isFoundHint={!!hint}
            solveSudoku={solveSudoku}
          />
        </div>
      </div>
    </div>
  )

  function requestNewGame(difficulty: GameDifficulty) {
    setNewGame(new Game(difficulty))
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

  function checkForMistakes() {
    if (![GameState.Intial, GameState.InProgress].includes(game.state)) {
      return
    }
    setMistakes(sudoku.findMistakes())
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
    if (![GameState.Intial, GameState.InProgress].includes(game.state)) {
      return
    }
    if (!selectedCell) {
      return
    }
    setSudoku(prevSudoku => prevSudoku.updateCell(value, selectedCell[0], selectedCell[1]))
  }
}
