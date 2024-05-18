import { CellValue } from "@/models/sudoku";

export class MistakeError extends Error {
  constructor(public readonly mistakes: [number, number, CellValue][], message: string) {
    super(message)
  }
}