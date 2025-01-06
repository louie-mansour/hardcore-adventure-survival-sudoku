import { easySudokus } from "./easy";
import { mediumSudokus } from "./medium";
import { hardSudokus } from "./hard";
import { CellValue, Sudoku } from "../models/sudoku";
import { GameDifficulty } from "@/models/game";

const easySudokuList = easySudokus
  .trim()
  .split(/\r?\n/)
  .map(s => s.split(' ')[1])

const mediumSudokuList = mediumSudokus
.trim()
.split(/\r?\n/)
.map(s => s.split(' ')[1])

const hardSudokuList = hardSudokus
.trim()
.split(/\r?\n/)
.map(s => s.split(' ')[1])

interface Args {
  index?: number,
  difficulty: GameDifficulty
}

export function findSudoku({ difficulty, index }: Args): Sudoku {
  const sudokuList = chooseSudokuList(difficulty)
  const sudokuIndex = index ?? Math.round(Math.random() * sudokuList.length - 2)
  const encodedSudoku = easySudokuList[sudokuIndex]
  const cells: CellValue[][] = []
  for (let j = 0; j < encodedSudoku.length; j += 9) {
    const chunk = encodedSudoku
    .slice(j, j + 9)
    .split("")
    .map(x => {
      if (x === "0") return null as CellValue
      return x as CellValue
    })
    cells.push(chunk)
  }
  return Sudoku.createSudoku(cells)
}

function chooseSudokuList(difficulty: GameDifficulty): string[] {
  switch (difficulty) {
    case GameDifficulty.Easy: return easySudokuList
    // case GameDifficulty.Medium: return mediumSudokuList
    // case GameDifficulty.Hard: return hardSudokuList
  }
}