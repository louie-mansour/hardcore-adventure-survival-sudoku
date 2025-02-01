import { EndGameError } from "@/models/errors/endGame"
import { thisWillEndCurrentGameText } from "@/text"

export enum GameDifficulty {
  Easy = 'easy',
  // Medium = 'medium',
  // Hard = 'hard',
}

export enum GameState {
  Intial = 'initial',
  InProgress = 'inProgress',
  Paused = 'paused',
  Success = 'success',
  Fail = 'fail',
}

export class Game {
  difficulty: GameDifficulty
  state: GameState

  constructor(
    difficulty: GameDifficulty = GameDifficulty.Easy,
    state: GameState = GameState.Intial,
  ) {
    this.difficulty = difficulty
    this.state = state
  }

  static clone(game: Game): Game {
    return new Game(game.difficulty, game.state)
  }

  start(): boolean {
    this.state = GameState.InProgress
    return true
  }

  pause(): boolean {
    if (this.state !== GameState.InProgress) {
      return false
    }
    this.state = GameState.Paused
    return true
  }

  fail(): boolean {
    if (this.state !== GameState.InProgress) {
      return false
    }
    this.state = GameState.Fail
    return true
  }

  complete(): boolean {
    if (this.state !== GameState.InProgress) {
      return false
    }
    this.state = GameState.Success
    return true
  }

  newGame(difficulty: GameDifficulty): Game {
    const newGame = new Game(difficulty, GameState.Intial)
    if ([GameState.InProgress].includes(this.state)) {
      throw new EndGameError(newGame, thisWillEndCurrentGameText)
    }
    return newGame
  }
}
