import { CellValue } from "@/models/sudoku";

export class MistakeError extends Error {
  constructor(public readonly mistake: [number, number, CellValue], message: string) {
    super(message)
  }
}