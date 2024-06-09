'use client'

import { CellValue, Sudoku } from "@/models/Sudoku";
import { getSudoku } from "@/services/sudokuService";
import { useEffect, useState } from "react";
import { MistakeError } from "../errors/mistake";
import DifficultySelector from "./sudoku-page/difficultySelector";
import HintPanel from "./sudoku-page/hintPanel";
import OptionsSelector from "./sudoku-page/optionsSelector";
import Sudoku9x9Grid from "./sudoku-page/sudoku-grid/sudokuGrid";
import Title from "./sudoku-page/title";
import Toolbox from "./sudoku-page/toolbox";


export default function Home() {
  // Game states
  const [currentGameSettings, setCurrentGameSettings] = useState<GameSettings>({
    difficulty: GameDifficulty.Easy,
    state: GameState.Intial,
  })
  const [newGameSettings, setNewGameSettings] = useState<GameSettings | null>(null)
  const [isHardcoreModeEnabled, setIsHardcoreModeEnabled] = useState(false)
  const [isOngoingHintsModeEnabled, setIsOngoingHintsModeEnabled] = useState(false)

  // Sudoku states
  const [sudoku, setSudoku] = useState<Sudoku>(getSudoku({ difficulty: currentGameSettings.difficulty, index: 4 }))
  const [mistakes, setMistakes] = useState<[number, number, CellValue][]>([])
  const [isRevealMistakes, setIsRevealMistakes] = useState(false)
  const [hint, setHint] = useState<[number, number, CellValue] | null>(null)
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (!newGameSettings) {
      return
    }

    if ([GameState.InProgress, GameState.Paused].includes(currentGameSettings.state)) {
      const isConfirmGetNewGame = confirm('this will end your current game.\nAre you sure?')
      if (!isConfirmGetNewGame) {
        return
      }
    }

    setCurrentGameSettings({
      difficulty: newGameSettings.difficulty,
      state: GameState.Intial,
    })

    setNewGameSettings(null)
    setSudoku(getSudoku({ difficulty: newGameSettings.difficulty }))
    setMistakes([])
    setHint(null)
    setSelectedCell(null)
    setIsOngoingHintsModeEnabled(false)
  }, [newGameSettings, currentGameSettings.state])

  return (
    <div className="w-full h-screen	flex flex-row justify-center bg-yellow-50">
      <div className="bg-white w-full max-w-2xl">
        <div className='h-full flex flex-col justify-evenly my-0 mx-16'>
          <Title />
          <DifficultySelector requestNewGame={requestNewGame} difficulty={currentGameSettings.difficulty} />
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
    setNewGameSettings({
      difficulty: difficulty,
      state: GameState.Intial,
    })
  }

  function updateSudoku(value: CellValue, row: number, col: number) {
    if (![GameState.Intial, GameState.InProgress].includes(currentGameSettings.state)) {
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
      setCurrentGameSettings(prevGameSettings => {
        return {
          ...prevGameSettings,
          state: GameState.Success,
        }
      })
      return
    }

    setCurrentGameSettings(prevGameSettings => {
      return {
        ...prevGameSettings,
        state: GameState.InProgress,
      }
    })

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
    if (![GameState.Intial, GameState.InProgress].includes(currentGameSettings.state)) {
      return
    }
    setMistakes(sudoku.findMistakes())
  }

  function revealMistakes() {
    if (![GameState.Intial, GameState.InProgress].includes(currentGameSettings.state)) {
      return
    }
    setIsRevealMistakes(true)
  }

  function getHint() {
    if (![GameState.Intial, GameState.InProgress].includes(currentGameSettings.state)) {
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
    if (![GameState.Intial, GameState.InProgress].includes(currentGameSettings.state)) {
      return
    }
    const revealedHint = sudoku.revealHint()
    const newSudoku = sudoku.updateCell(revealedHint[2], revealedHint[0], revealedHint[1])
    setSudoku(newSudoku)
    setCurrentGameSettings(prevGameSettings => {
      return {
        ...prevGameSettings,
        state: GameState.InProgress,
      }
    })

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
    if (![GameState.Intial, GameState.InProgress].includes(currentGameSettings.state)) {
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
    if (![GameState.Intial, GameState.InProgress].includes(currentGameSettings.state)) {
      return
    }
    if (!selectedCell) {
      return
    }
    setSudoku(prevSudoku => prevSudoku.updateCell(value, selectedCell[0], selectedCell[1]))
  }
}

export enum GameDifficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export enum GameState {
  Intial = 'initial',
  InProgress = 'inProgress',
  Paused = 'paused',
  Success = 'success',
  Fail = 'fail',
}

export enum GameOption {
  HardcoreMode = 'hardcoreMode',
  OngoingHintsMode = 'ongoingHintsMode',
}

export interface GameSettings {
  difficulty: GameDifficulty,
  state: GameState,
}