import { EndGameError } from "@/errors/endGame";
import { Game, GameDifficulty } from "@/models/game";
import { CellType, Sudoku } from "@/models/sudoku";
import { getSudoku } from "@/services/sudokuService";
import { useEffect, useState } from "react";
import SudokuArea from "../sudoku/sudokuArea";
import DifficultySelector from "./difficultySelector";
import OptionsSelector from "./optionsSelector";
import Title from "./title";

export enum GameMode {
  Hardcore = 'Hardcore',
  Normal = 'Normal',
  OngoingHints = 'OngoingHints',
}

export default function PlayArea() {
  const [game, setGame] = useState<Game>(() => new Game())
  const [newGame, setNewGame] = useState<Game | null>(null)
  const [isHardcoreModeEnabled, setIsHardcoreModeEnabled] = useState(true)
  const [isOngoingHintsModeEnabled, setIsOngoingHintsModeEnabled] = useState(false)
  // TODO: this renders multiple times. The hack is to set the index explicitly so it's idempotent
  const [initialSudoku, setInitialSudoku] = useState<Sudoku>(() => getSudoku({ difficulty: game.difficulty, index: 4 }))
  const [itemLocations, setItemLocations] = useState<[string, number, number][]>([])

  useEffect(() => {
    if (initialSudoku && itemLocations.length === 0) {
      setItemLocations(determineItemLocations(initialSudoku))
    }
  }, [initialSudoku])

  useEffect(() => {
    if (!newGame) {
      return
    }

    setGame(g => {
      try {
        const nGame = g.newGame(newGame.difficulty)
        setInitialSudoku(getSudoku({ difficulty: nGame.difficulty }))
        return nGame
      } catch (e: unknown) {
        if (!(e instanceof EndGameError)) {
          return g
        }
        if (!confirm(e.message)) {
          return g
        }
        setInitialSudoku(getSudoku({ difficulty: e.game.difficulty }))
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
            enableHardcoreMode={enableHardcoreMode}
            isHardcoreModeEnabled={isHardcoreModeEnabled}
            isOngoingHintsModeEnabled={isOngoingHintsModeEnabled}
          />
          <div className='flex flex-col justify-center items-center'>
            <SudokuArea
              initialSudoku={initialSudoku}
              gameMode={getMode(isHardcoreModeEnabled, isOngoingHintsModeEnabled)}
              itemLocations={isHardcoreModeEnabled ? itemLocations : []}
              solveSudoku={solveSudoku}
              gameStart={gameStart}
              gameOver={gameOver}
              gameComplete={gameComplete}
            />
          </div>
        </div>
      </div>
    </div>
  )

  function requestNewGame(difficulty: GameDifficulty) {
    setNewGame(new Game(difficulty))
  }

  function gameStart() {
    setGame(g => g.start())
  }

  function gameOver() {
    setGame(g => g.fail())
  }

  function gameComplete() {
    setGame(g => g.complete())
  }

  function enableOngoingHintsMode(isEnable: boolean) {
    setIsOngoingHintsModeEnabled(isEnable)
  }

  function enableHardcoreMode(isEnable: boolean) {
    setIsHardcoreModeEnabled(isEnable)
  }

  function getMode(isHardcoreModeEnabled: boolean, isOngoingHintsModeEnabled: boolean): GameMode {
    if (isHardcoreModeEnabled) {
      return GameMode.Hardcore
    }
    if (isOngoingHintsModeEnabled) {
      return GameMode.OngoingHints
    }
    return GameMode.Normal
  }

  function solveSudoku() {
    setInitialSudoku(s => s.getSolution())
    setGame(g => g.complete())
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

    for (let i = 0; i < negativeEffectsToDistribute.length; i++) {
      const locationIndex = Math.floor(Math.random() * availableLocations.length)
      const location = availableLocations[locationIndex]
      itemLocations.push([negativeEffectsToDistribute[i], location[0], location[1]])
      availableLocations.splice(locationIndex, 1)
    }
    return itemLocations
  }
}
