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
  // Paused = 'paused',
  Success = 'success',
  Fail = 'fail',
}

export class Game {
  readonly difficulty: GameDifficulty
  readonly state: GameState

  constructor(
    difficulty: GameDifficulty = GameDifficulty.Easy,
    state: GameState = GameState.Intial,
  ) {
    this.difficulty = difficulty
    this.state = state
  }

  start(): Game {
    return new Game(this.difficulty, GameState.InProgress)
  }

  fail(): Game {
    if (this.state === GameState.Fail) {
      return this
    }
    if (this.state !== GameState.InProgress) {
      throw new Error('Cannot fail a game unless it is in the in progress state. ' + this.state)
    }
    return new Game(this.difficulty, GameState.Fail)
  }

  complete(): Game {
    if (this.state === GameState.Success) {
      return this
    }
    if (this.state !== GameState.InProgress) {
      throw new Error('Cannot complete a game unless it is in the in progress state. ' + this.state)
    }
    return new Game(this.difficulty, GameState.Success)
  }

  newGame(difficulty: GameDifficulty): Game {
    const newGame = new Game(difficulty, GameState.Intial)
    if ([GameState.InProgress].includes(this.state)) {
      throw new EndGameError(newGame, thisWillEndCurrentGameText)
    }
    return newGame
  }
}
