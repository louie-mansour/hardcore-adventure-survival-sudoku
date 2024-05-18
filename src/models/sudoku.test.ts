import { CellType, CellValue, Sudoku } from "./sudoku"


function getTestSudokuGrid(): CellValue[][] {
  return [
    [null, null, "4",  null, "5",  null, null, null, null],
    ["9",  null, null, "7",  "3",  "4",  "6",  null, null],
    [null, null, "3",  null, "2",  "1",  null, "4",  "9" ],
    [null, "3",  "5",  null, "9",  null, "4",  "8",  null],
    [null, "9",  null, null, null, null, null, "3",  null],
    [null, "7",  "6",  null, "1",  null, "9",  "2",  null],
    ["3",  "1",  null, "9",  "7",  null,  "2",  null, null],
    [null, null, "9",  "1",  "8",  "2",  null, null, "3" ],
    [null, null, null, null, "6",  null, "1",  null, null],
  ]
}

describe('sudoku', () => {
  describe('createSudoku', () => {
    it('creates sudoku', () => {
      const sudoku = Sudoku.createSudoku(getTestSudokuGrid())
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const testCell = getTestSudokuGrid()[r][c]
          const sudokuCell = sudoku.cells[r][c]
          expect(testCell).toEqual(sudokuCell.value)

          if (testCell) {
            expect(sudokuCell.cellType).toEqual(CellType.Fixed)
          } else {
            expect(sudokuCell.cellType).toEqual(CellType.Variable)
          }
        }
      }
    })

    it('throws error when lengths are incorrect', () => {
      const testSudokuGrid0 = getTestSudokuGrid()
      testSudokuGrid0.push(['1'])
      expect(() => Sudoku.createSudoku(testSudokuGrid0)).toThrow()

      const testSudokuGrid1 = getTestSudokuGrid()
      testSudokuGrid1[0].push('1')
      expect(() => Sudoku.createSudoku(testSudokuGrid1)).toThrow()
    })
  })

  describe('update', () => {
    const sudoku = Sudoku.createSudoku(getTestSudokuGrid())
    it('Can update Variable cell type', () => {
      const udpatedSudoku = sudoku.updateCell('1', 0, 0)
      expect(udpatedSudoku.cells[0][0].value).toEqual('1')
    })

    it('Cannot update Fixed cell type', () => {
      expect(() => sudoku.updateCell('1', 0, 2)).toThrow()
    })
  })

  describe('solve', () => {
    const sudoku = Sudoku.createSudoku(getTestSudokuGrid())

    it('solves sudokus', () => {
      const solvedGrid = [
        ['2', '6', '4', '8', '5', '9', '3', '1', '7'],
        ['9', '8', '1', '7', '3', '4', '6', '5', '2'],
        ['7', '5', '3', '6', '2', '1', '8', '4', '9'],
        ['1', '3', '5', '2', '9', '7', '4', '8', '6'],
        ['8', '9', '2', '5', '4', '6', '7', '3', '1'],
        ['4', '7', '6', '3', '1', '8', '9', '2', '5'],
        ['3', '1', '8', '9', '7', '5', '2', '6', '4'],
        ['6', '4', '9', '1', '8', '2', '5', '7', '3'],
        ['5', '2', '7', '4', '6', '3', '1', '9', '8']
      ]

      const solved = sudoku.getSolution()
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          expect(solved.cells[r][c].value).toEqual(solvedGrid[r][c])
          if (getTestSudokuGrid()[r][c] === null) {
            expect(solved.cells[r][c].cellType).toEqual(CellType.Variable)
          } else {
            expect(solved.cells[r][c].cellType).toEqual(CellType.Fixed)
          }
        }
      }
    })
  })

  describe('findErrors', () => {
    it('Unchanged sudokus have no errors', () => {
      const sudoku = Sudoku.createSudoku(getTestSudokuGrid())
      expect(sudoku.findMistakes().length).toEqual(0)
    })

    it('returns an empty array if no errors are found', () => {
      const sudoku = Sudoku.createSudoku(getTestSudokuGrid())
      sudoku.updateCell('2', 0, 0)
      sudoku.updateCell('6', 0, 1)
      expect(sudoku.findMistakes().length).toEqual(0)
    })

    it('returns an item if one error is found', () => {
      const sudoku = Sudoku.createSudoku(getTestSudokuGrid())
      sudoku.updateCell('3', 0, 0)
      sudoku.updateCell('6', 0, 1)
      const errors = sudoku.findMistakes()
      expect(errors.length).toEqual(1)
      expect(errors[0]).toEqual([0, 0, '2'])

    })

    it('returns two items if two errors are found', () => {
      const sudoku = Sudoku.createSudoku(getTestSudokuGrid())
      sudoku.updateCell('3', 0, 0)
      sudoku.updateCell('4', 0, 1)

      const errors = sudoku.findMistakes()
      expect(errors.length).toEqual(2)
      expect(errors[0]).toEqual([0, 0, '2'])
      expect(errors[1]).toEqual([0, 1, '6'])
    })
  })

  describe('getHint', () => {
    it('Returns a hint', () => {
      const sudoku = Sudoku.createSudoku(getTestSudokuGrid())
      expect(sudoku.getHint()).toEqual([4, 4, null])
    })

    it('Throws an error if the sudoku has a mistake', () => {
      const sudoku = Sudoku.createSudoku(getTestSudokuGrid())
      sudoku.updateCell('3', 0, 0)
      expect(() => sudoku.getHint()).toThrow()
    })

    it('Can continue getting hints until the sudoku is solved', () => {
      const sudoku = Sudoku.createSudoku(getTestSudokuGrid())
      try {
        while (true) {
          sudoku.getHint()
          const [r, c, v] = sudoku.revealHint()
          sudoku.updateCell(v, r, c)
        }
      } catch (err) {
        expect(sudoku.cells.flatMap(x => x).map(x => x.value)).toEqual(sudoku.getSolution().cells.flatMap(x => x).map(x => x.value))
      }
    })
  })
})

export {}