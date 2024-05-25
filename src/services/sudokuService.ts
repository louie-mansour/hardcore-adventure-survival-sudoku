import { CellValue, Sudoku } from "..//models/Sudoku";

export function getSudoku(): Sudoku {
  const encodedSudoku = '600050007030000000080409200015300000008000300000007590009501030000000080200070004'
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

  // return Sudoku.createSudoku([
  //   [null, null, "4",  null, "5",  null, null, null, null],
  //   ["9",  null, null, "7",  "3",  "4",  "6",  null, null],
  //   [null, null, "3",  null, "2",  "1",  null, "4",  "9" ],
  //   [null, "3",  "5",  null, "9",  null, "4",  "8",  null],
  //   [null, "9",  null, null, null, null, null, "3",  null],
  //   [null, "7",  "6",  null, "1",  null, "9",  "2",  null],
  //   ["3",  "1",  null, "9",  "7",  null,  "2",  null, null],
  //   [null, null, "9",  "1",  "8",  "2",  null, null, "3" ],
  //   [null, null, null, null, "6",  null, "1",  null, null],
  // ])
}
