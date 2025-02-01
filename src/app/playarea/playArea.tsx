import { EndGameError } from "@/models/errors/endGame";
import { Game, GameDifficulty, GameState } from "@/models/game";
import { Sudoku } from "@/models/sudoku";
import { findSudoku } from "@/services/sudokuService";
import { useEffect, useRef, useState } from "react";
import SudokuArea from "../sudoku/sudokuArea";
import DifficultySelector from "./difficultySelector";
import Title from "./title";
import { determineItemLocations, Item } from '../../models/item'
import { SudokuConfig } from "@/config";
import HowToPlay from "./howToPlay";
import { determineEffectTimings, NegativeEffect } from "@/models/effect";

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
  const [game, setGame] = useState<Game>(new Game())
  const [newGame, setNewGame] = useState<Game | null>(null)
  // TODO: this renders multiple times. The hack is to set the index explicitly so it's idempotent
  const [sudoku, setSudoku] = useState<Sudoku>(() => findSudoku({ difficulty: game.difficulty, index: 4 }))
  const [itemLocations, setItemLocations] = useState<[Item, number, number, boolean][]>([])
  const [negativeEffectTimers, setNegativeEffectTimers] = useState<Map<number, NegativeEffect[]>>(new Map())
  const [gameTimer, setGameTimer] = useState<number>(0)
  const gameTimerTimout = useRef<NodeJS.Timeout | null>(null)
  
  if (!gameTimerTimout.current) {
    gameTimerTimout.current = setInterval(() => {
      let currentGameState
      setGame(g => { // Work around in order to access current game in the setInterval closures
        currentGameState = g.state
        if (currentGameState !== GameState.InProgress) {
          return g
        }
        setGameTimer(t => t + 1)
        return g
      })
    }, 1000)
  }

  // TODO: Not sure why useEffect is needed here
  // Louie - Need to implement the game going into 'In Progress' so we can ask the user if they want to confirm starting a new game
  useEffect(() => {
    if (sudoku && itemLocations.length === 0) {
      setItemLocations(determineItemLocations(sudoku))
      setNegativeEffectTimers(determineEffectTimings())
      
    }
  }, [sudoku, itemLocations, setItemLocations])

  useEffect(() => {
    setNegativeEffectTimers(determineEffectTimings())
  }, [])

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
          <HowToPlay gamePause={gamePause} gameStart={gameStart} />
          <DifficultySelector requestNewGame={requestNewGame} difficulty={game.difficulty} />
          <SudokuArea
            initialSudoku={sudoku}
            itemLocations={itemLocations}
            removeItemLocation={removeItemLocation}
            solveSudoku={solveSudoku}
            gameStart={gameStart}
            gameOver={gameOver}
            gameComplete={gameComplete}
            gameTimer={gameTimer}
            config={config}
            negativeEffectTimers={negativeEffectTimers}
          />
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
    setGame(g => {
      g.start()
      return Game.clone(g)
    })
  }

  function gamePause() {
    setGame(g => {
      g.pause()
      return Game.clone(g)
    })
  }

  function gameOver() {
    setGame(g => {
      g.fail()
      return Game.clone(g)
    })
  }

  function gameComplete() {
    setGame(g => {
      g.complete()
      return Game.clone(g)
    })
  }

  function solveSudoku() {
    setSudoku(s => s.getSolution())
    setGame(g => {
      g.complete()
      return Game.clone(g)
    })
  }
}
