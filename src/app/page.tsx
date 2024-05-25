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


export default function Home() {
  // Game states
  const [currentGameSettings, setCurrentGameSettings] = useState<GameSettings>({
    difficulty: GameDifficulty.Medium,
    state: GameState.Intial,
  })
  const [newGameSettings, setNewGameSettings] = useState<GameSettings | null>(null)
  const [isHardcoreModeEnabled, setIsHardcoreModeEnabled] = useState(false)
  const [isOngoingHintsModeEnabled, setIsOngoingHintsModeEnabled] = useState(false)

  // Sudoku states
  const [sudoku, setSudoku] = useState<Sudoku>(getSudoku())
  const [mistakes, setMistakes] = useState<[number, number, CellValue][]>([])
  const [isRevealMistakes, setIsRevealMistakes] = useState(false)
  const [hint, setHint] = useState<[number, number, CellValue] | null>(null)

  useEffect(() => {
    if (!newGameSettings) {
      return
    }

    if ([GameState.InProgress, GameState.Paused].includes(currentGameSettings.state)) {
      const isConfirmGetNewGame = confirm('That will end your current game.\nAre you sure?')
      if (!isConfirmGetNewGame) {
        return
      }
    }

    setCurrentGameSettings({
      difficulty: newGameSettings.difficulty,
      state: GameState.Intial,
    })
    setNewGameSettings(null)

    const sudoku = getSudoku()
    setSudoku(sudoku)
  }, [newGameSettings, currentGameSettings.state])

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: 'lightyellow',
    }}>
      <div style={{
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '700px',
      }}>
        <div style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          margin: '0 80px',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            width: '100%',
            maxWidth: '700px',
          }}>
            <Title />
          </div>
          <DifficultySelector requestNewGame={requestNewGame} difficulty={currentGameSettings.difficulty} />
          <OptionsSelector
            enableOngoingHintsMode={enableOngoingHintsMode}
            enableHardcoreMode={setIsHardcoreModeEnabled}
            isHardCodeModeEnabled={isHardcoreModeEnabled}
            isOngoingHintsModeEnabled={isOngoingHintsModeEnabled}/>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Sudoku9x9Grid sudoku={sudoku} updateSudoku={updateSudoku} hint={hint} mistakes={isRevealMistakes ? mistakes : []}/>
          </div>
          <HintPanel
            checkForMistakes={checkForMistakes} revealMistakes={revealMistakes} isFoundMistakes={mistakes.length > 0}
            getHint={getHint} revealHint={revealHint} isFoundHint={!!hint}
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
      setHint(newSudoku.getHint({ allowMistakes: true }))
      setMistakes(newSudoku.findMistakes())
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
        return prevMistakes.filter(m => m[0] !== row || m[1] !== col)
      }
      return prevMistakes
    })
  }

  function checkForMistakes() {
    setMistakes(sudoku.findMistakes())
  }

  function revealMistakes() {
    setIsRevealMistakes(sudoku.findMistakes().length > 0)
  }

  function getHint() {
    try {
      setHint(sudoku.getHint())
    } catch (err: unknown) {
      if (err instanceof MistakeError) {
        setIsRevealMistakes(true)
      }
    }
  }

  function revealHint() {
    const revealedHint = sudoku.revealHint()
    setSudoku(sudoku.updateCell(revealedHint[2], revealedHint[0], revealedHint[1]))
    setHint(null)
    setCurrentGameSettings(prevGameSettings => {
      return {
        ...prevGameSettings,
        state: GameState.InProgress,
      }
    })
  }

  function solveSudoku() {
    setSudoku(sudoku.getSolution())
  }

  function enableOngoingHintsMode(isEnable: boolean) {
    setIsOngoingHintsModeEnabled(isEnable)

    if (!isEnable) {
      setHint(null)
      setMistakes([])
      return
    }

    try {
      setHint(sudoku.getHint({ allowMistakes: true }))
    } catch (err: unknown) {
      if (err instanceof MistakeError) {
        setMistakes(err.mistakes)
      }
    }
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