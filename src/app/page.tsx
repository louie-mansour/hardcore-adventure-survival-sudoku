'use client'

import { CellValue, Sudoku } from "@/models/Sudoku";
import { getSudoku } from "@/services/sudokuService";
import { useEffect, useState } from "react";
import { MistakeError } from "../errors/mistake";
import CheckButton from "./sudoku-page/checkButton";
import DifficultySelector from "./sudoku-page/difficultySelector";
import HintButton from "./sudoku-page/hintButton";
import OptionsSelector from "./sudoku-page/optionsSelector";
import SolveButton from "./sudoku-page/solveSudoku";
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
  const [isFoundMistakes, setIsFoundMistakes] = useState(false)
  const [hint, setHint] = useState<[number, number, CellValue] | null>(null)

  useEffect(() => {
    if (!newGameSettings) {
      return
    }

    if ([GameState.InProgress, GameState.Paused].includes(currentGameSettings.state)) {
      const isConfirmGetNewGame = confirm('are you sure?')
      if (!isConfirmGetNewGame) {
        return
      }
    }

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
          <DifficultySelector requestNewGame={requestNewGame}/>
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
            <Sudoku9x9Grid sudoku={sudoku} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes}/>
          </div>
          <CheckButton checkForMistakes={checkForMistakes} revealMistakes={revealMistakes} isFoundErrors={isFoundMistakes}/>
          <HintButton getHint={getHint} revealHint={revealHint} isFoundHint={!!hint} />
          <SolveButton solveSudoku={solveSudoku} />
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
    const newSudoku = sudoku.updateCell(value, row, col)
    setSudoku(newSudoku)

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
    setIsFoundMistakes(sudoku.findMistakes().length > 0)
  }

  function revealMistakes() {
    setMistakes(sudoku.findMistakes())
  }

  function getHint() {
    try {
      setHint(sudoku.getHint())
    } catch (err: unknown) {
      if (err instanceof MistakeError) {
        setIsFoundMistakes(true)
      }
    }
  }

  function revealHint() {
    const revealedHint = sudoku.revealHint()
    setSudoku(sudoku.updateCell(revealedHint[2], revealedHint[0], revealedHint[1]))
    setHint(null)
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