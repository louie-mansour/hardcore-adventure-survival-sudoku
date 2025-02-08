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
import { determineEffectTimings, NegativeEffect, NegativeEffectEmoji } from "@/models/effect";
import { createPortal } from "react-dom";

interface PlayAreaProps {
  config: SudokuConfig
  sudokuNumber: number
}

export default function PlayArea(props: PlayAreaProps) {  
  const { config, sudokuNumber } = props
  const [game, setGame] = useState<Game>(new Game())
  const [newGame, setNewGame] = useState<Game | null>(null)
  // This is a hack but it works. We need the same random number generated on the server and on the client
  const [sudoku, setSudoku] = useState<Sudoku>(() => findSudoku({ difficulty: game.difficulty, index: sudokuNumber })) // Number(document?.getElementById('sudoku-number')?.getAttribute('data-sn') ?? sudokuNumber) }))
  const [itemLocations, setItemLocations] = useState<[Item, number, number, boolean][]>([])
  const [negativeEffectTimers, setNegativeEffectTimers] = useState<Map<number, NegativeEffect[]>>(new Map())
  const [gameTimer, setGameTimer] = useState<number>(0)
  const gameTimerTimout = useRef<NodeJS.Timeout | null>(null)
  const [placedEffectLocations, setPlacedEffectLocations] = useState<Map<string, NegativeEffectEmoji>>(new Map())
  const [numberOfLives, setNumberOfLives] = useState<number>(config.startingNumberOfLives)
  
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
  useEffect(() => {
    if (sudoku && itemLocations.length === 0) {
      setItemLocations(determineItemLocations(sudoku))
      setNegativeEffectTimers(determineEffectTimings())
      
    }
  }, [sudoku, itemLocations, setItemLocations])

  useEffect(() => {
    setNegativeEffectTimers(determineEffectTimings())
  }, [])

  useEffect(() => {
    if(game.state === GameState.Fail) {
      createPortal(
        <GameOverModal
          onNewGame={() => requestNewGame(game.difficulty)}
        />,
        document.body
      )
    }
    if (game.state === GameState.Success) {
      createPortal(
        <SuccessModal
          onNewGame={() => requestNewGame(game.difficulty)}
        />,
        document.body
      )
    }
  }, [game])

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
        setSudoku(s => {
          const newS = findSudoku({ difficulty: e.game.difficulty })
          setItemLocations(determineItemLocations(newS))
          setNegativeEffectTimers(determineEffectTimings())
          setGameTimer(0)
          setPlacedEffectLocations(new Map())
          setNumberOfLives(config.startingNumberOfLives)
          return newS
        })
        return e.game
      } finally {
        setNewGame(null)
      }
    })
  }

  return (
    <div className="w-full h-full	flex flex-row justify-center bg-page-outside-light h-svh">
      <div className="bg-page-inside-light w-full max-w-2xl">
        <div className='h-screen flex flex-col justify-evenly my-0 mx-5 h-svh gap-2 pt-8'>
          <div>
            <Title />
            <HowToPlay gamePause={gamePause} gameStart={gameStart} />
          </div>
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
            placedEffectLocations={placedEffectLocations}
            setPlacedEffectLocations={setPlacedEffectLocations as any}
            numberOfLives={numberOfLives}
            setNumberOfLives={setNumberOfLives as any}
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

function GameOverModal({ onNewGame } : { onNewGame: () => void }) {
  return (
    <div 
      className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div 
        className="modal relative p-4 bg-white rounded shadow-md flex flex-col items-center"
        style={{ width: 'fit-content', height: 'fit-content' }}
      >
        <div>☠️ Game Over ☠️</div>
        <button onClick={onNewGame} className="mt-4 p-2 bg-red-500 text-white rounded">New Game</button>
      </div>
    </div>
  );
}

function SuccessModal({ onNewGame } : { onNewGame: () => void }) {
  return (
    <div 
      className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div 
        className="modal relative p-4 bg-white rounded shadow-md flex flex-col items-center"
        style={{ width: 'fit-content', height: 'fit-content' }}
      >
        <div>🎉 You win! 🎉</div>
        <button onClick={onNewGame} className="mt-4 p-2 bg-red-500 text-white rounded">New Game</button>
      </div>
    </div>
  );
}