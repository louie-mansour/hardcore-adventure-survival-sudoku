import { Game } from "@/models/game";

export class EndGameError extends Error {
  constructor(public readonly game: Game, message: string) {
    super(message)
  }
}