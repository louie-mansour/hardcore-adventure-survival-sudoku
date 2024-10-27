import { EndGameError } from "@/errors/endGame";
import { Game, GameDifficulty } from "@/models/game";
import { CellType, Sudoku } from "@/models/sudoku";
import { getSudoku } from "@/services/sudokuService";
import { useEffect, useState } from "react";
import SudokuArea from "../sudoku/sudokuArea";
import DifficultySelector from "./difficultySelector";
// import OptionsSelector from "./optionsSelector";
import Title from "./title";
import { Item, ItemName } from '../../models/item'

export enum GameMode {
  Hardcore = 'Hardcore',
  Normal = 'Normal',
  OngoingHints = 'OngoingHints',
}

export default function PlayArea() {
  const [game, setGame] = useState<Game>(() => new Game())
  const [newGame, setNewGame] = useState<Game | null>(null)
  // TODO: this renders multiple times. The hack is to set the index explicitly so it's idempotent
  const [initialSudoku, setInitialSudoku] = useState<Sudoku>(() => getSudoku({ difficulty: game.difficulty, index: 4 }))
  const [itemLocations, setItemLocations] = useState<[Item, number, number, boolean][]>([])

  useEffect(() => {
    if (initialSudoku && itemLocations.length === 0) {
      setItemLocations(determineItemLocations(initialSudoku))
    }

    function determineItemLocations(sudoku: Sudoku): [Item, number, number, boolean][] {
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
  
      const itemsToDistribute = [
        Item.factory(ItemName.Shield),
        Item.factory(ItemName.Shield),
        Item.factory(ItemName.MagicWand),
        Item.factory(ItemName.MagicWand),
        Item.factory(ItemName.CrystalBall),
        Item.factory(ItemName.CrystalBall),
        Item.factory(ItemName.Plant),
        Item.factory(ItemName.Plant),
        Item.factory(ItemName.GameDie),
        Item.factory(ItemName.GameDie),
      ]
  
      const itemLocations: [Item, number, number, boolean][] = []
      for (let i = 0; i < itemsToDistribute.length; i++) {
        const locationIndex = Math.floor(Math.random() * availableLocations.length)
        const location = availableLocations[locationIndex]
        itemLocations.push([itemsToDistribute[i], location[0], location[1], true])
        availableLocations.splice(locationIndex, 1)
      }
      return itemLocations
    }
  }, [initialSudoku, itemLocations, setItemLocations])

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
  }, [newGame, setGame, game])

  return (
    <div className="w-full h-full	flex flex-row justify-center bg-yellow-50 h-svh">
      <div className="bg-white w-full max-w-2xl">
        <div className='h-screen flex flex-col justify-evenly my-0 mx-5 h-svh gap-2 pt-8'>
          <Title />
          <DifficultySelector requestNewGame={requestNewGame} difficulty={game.difficulty} />
          <div className='flex flex-col justify-center items-center'>
            <SudokuArea
              initialSudoku={initialSudoku}
              itemLocations={itemLocations}
              removeItemLocation={removeItemLocation}
              negativeEffectLocations={[]}
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
    setInitialSudoku(s => s.getSolution())
    setGame(g => g.complete())
  }
}
