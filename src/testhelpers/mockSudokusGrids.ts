import { CellValue } from "@/models/sudoku"

export const getEasyMockSudokuGrid = () => {
  const index = Math.round(Math.random() * 2)
  return easyMockSudokuGrids[index]
}

const easyMockSudokuGrids: CellValue[][][] = [
  [
    [null, null, "4",  null, "5",  null, null, null, null],
    ["9",  null, null, "7",  "3",  "4",  "6",  null, null],
    [null, null, "3",  null, "2",  "1",  null, "4",  "9" ],
    [null, "3",  "5",  null, "9",  null, "4",  "8",  null],
    [null, "9",  null, null, null, null, null, "3",  null],
    [null, "7",  "6",  null, "1",  null, "9",  "2",  null],
    ["3",  "1",  null, "9",  "7",  null,  "2",  null, null],
    [null, null, "9",  "1",  "8",  "2",  null, null, "3" ],
    [null, null, null, null, "6",  null, "1",  null, null],
  ],
  [
    ["8",  null, "6",  null, "1",  null, null, null, null],
    [null, null, "3",  null, "6",  "4",  null, "9",  null],
    ["9",  null, null, null, null, null, "8",  "1",  "6" ],
    [null, "8",  null, "3",  "9",  "6",  null, null, null],
    ["7",  null, "2",  null, "4",  null, "3",  null, "9" ],
    [null, null, null, "5",  "7",  "2",  null, "8",  null],
    ["5",  "2",  "1",  null, null, null, null, null, "4" ],
    [null, "3",  null, "7",  "5",  null, "2",  null, null],
    [null, null, null, null, "2",  null, "1",  null, "5" ],
  ],
]