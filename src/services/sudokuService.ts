import { CellValue, Sudoku } from "..//models/Sudoku";

export function getSudoku(): Sudoku {
  const encodedSudoku = '080200400570000100002300000820090005000715000700020041000006700003000018007009050'
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
