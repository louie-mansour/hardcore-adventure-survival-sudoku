import { EndGameError } from "@/models/errors/endGame";
import { Game, GameDifficulty, GameState } from "@/models/game";
import { Sudoku } from "@/models/sudoku";
import { findSudoku } from "@/services/sudokuService";
import { useEffect, useState } from "react";
import SudokuArea from "../sudoku/sudokuArea";
import DifficultySelector from "./difficultySelector";
import Title from "./title";
import { determineItemLocations, Item } from '../../models/item'
import { SudokuConfig } from "@/config";

export enum GameMode {
  Hardcore = 'Hardcore',
  Normal = 'Normal',
  OngoingHints = 'OngoingHints',
}

interface PlayAreaProps {
  config: SudokuConfig
}

export default function PlayArea(props: PlayAreaProps) {
  const { config } = props
  const [game, setGame] = useState<Game>(() => new Game())
  const [newGame, setNewGame] = useState<Game | null>(null)
  // TODO: this renders multiple times. The hack is to set the index explicitly so it's idempotent
  const [sudoku, setSudoku] = useState<Sudoku>(() => findSudoku({ difficulty: game.difficulty, index: 4 }))
  const [itemLocations, setItemLocations] = useState<[Item, number, number, boolean][]>([])

  // TODO: Not sure why useEffect is needed here
  // Louie - Need to implement the game going into 'In Progress' so we can ask the user if they want to confirm starting a new game
  useEffect(() => {
    if (sudoku && itemLocations.length === 0) {
      setItemLocations(determineItemLocations(sudoku))
    }
  }, [sudoku, itemLocations, setItemLocations])

  if (newGame) {
    setGame(g => {
      try {
        const nGame = g.newGame(newGame.difficulty)
        const newlySelectedSudoku = findSudoku({ difficulty: nGame.difficulty })
        setSudoku(newlySelectedSudoku)
        return nGame
      } catch (e: unknown) {
        if (!(e instanceof EndGameError)) {
          return g
        }
        if (!confirm(e.message)) {
          return g
        }
        setSudoku(findSudoku({ difficulty: e.game.difficulty }))
        return e.game
      } finally {
        setNewGame(null)
      }
    })
  }

  if (game.state === GameState.Fail) {
    return <div>Game Over</div>
  }

  return (
    <div className="w-full h-full	flex flex-row justify-center bg-page-outside-light h-svh">
      <div className="bg-page-inside-light w-full max-w-2xl">
        <div className='h-screen flex flex-col justify-evenly my-0 mx-5 h-svh gap-2 pt-8'>
          <Title />
          <DifficultySelector requestNewGame={requestNewGame} difficulty={game.difficulty} />
          <div className='flex flex-col justify-center items-center'>
            <SudokuArea
              initialSudoku={sudoku}
              itemLocations={itemLocations}
              removeItemLocation={removeItemLocation}
              solveSudoku={solveSudoku}
              gameStart={gameStart}
              gameOver={gameOver}
              gameComplete={gameComplete}
              config={config}
            />
          </div>
        </div>
      </div>
    </div>
  )

  function removeItemLocation(r: number, c: number): boolean {
    let isRemove = false
    setItemLocations(il => {
      const idx = il.findIndex(e => e[1] === r && e[2] === c && e[3])
      if (idx === -1) {
        return [ ...il ]
      }
      isRemove = true
      il[idx] = [il[idx][0], il[idx][1], il[idx][2], false]
      return [ ...il ]
    })
    return isRemove
  }

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

  function solveSudoku() {
    setSudoku(s => s.getSolution())
    setGame(g => g.complete())
  }
}
