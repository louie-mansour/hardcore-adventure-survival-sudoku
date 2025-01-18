import { MistakeError } from './errors/mistake';
import { createSudokuAlgorithm, getHintAlgorithmDeprecated, solveAlgorithm } from './sudokuAlgorithms';

export type CellValue = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | null

export class Sudoku {
  public solved: Cell[][]
  private cells: Cell[][]
  private currentHint: [number, number, CellValue] | null
  public isSkeleton: boolean | undefined

  static createSudokuSkeleton(): Sudoku {
    const mockCells = Array.from(
      { length: 9 }, _r => Array.from(
        { length: 9 }, _c => Cell.createVariable(null)
      )
    )
    const s = new Sudoku(mockCells, mockCells)
    s.isSkeleton = true
    return s
  }

  static createSudoku(grid: CellValue[][]): Sudoku {
    const cells = createSudokuAlgorithm(grid)
    const solved = solveAlgorithm([...cells].map(c => [...c]))
    return new Sudoku(cells, solved)
  }

  getCells(): Cell[][] {
    return this.cells
  }

  deleteCell(row: number, col: number): Sudoku {
    if (this.cells[row][col].cellType === CellType.Fixed) {
      return new Sudoku([...this.cells], [...this.solved])
    }

    this.cells[row][col] = this.cells[row][col].updateValue(null)
    return new Sudoku(
      [...this.cells], [...this.solved]
    )
  }

  updateCell(value: CellValue, row: number, col: number): Sudoku {
    if (this.cells[row][col].value) {
      return new Sudoku([...this.cells], [...this.solved])
    }
    if (this.solved[row][col].value !== value) {
      throw new MistakeError([row, col, value], 'Incorrect value')
    }

    const cell = this.cells[row][col]
    this.cells[row][col] = cell.updateValue(value)
    
    return new Sudoku([...this.cells], [...this.solved])
  }

  getSolution(): Sudoku {
    return new Sudoku([ ...this.solved ], [ ...this.solved ])
  }

  getHint(): [number, number, null] {
    const [r, c, value] = getHintAlgorithmDeprecated(this.cells, this.solved)
    this.currentHint = [r, c, value]
    return [r, c, null]
  }

  revealHint(): [number, number, CellValue] {
    const currentHint = this.currentHint
    if (!currentHint) {
      throw new Error('There is no current hint to reveal')
    }
    return currentHint
  }

  isSolved(): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.cells[r][c].value !== this.solved[r][c].value) {
          return false
        }
      }
    }
    return true
  }

  private constructor(
    cells: Cell[][],
    solved: Cell[][],
    currentHint: [number, number, CellValue] | null = null,
  ) {
    this.cells = cells
    this.solved = solved
    this.currentHint = currentHint
  }
}

export class Cell {
  static createdFixed(value: CellValue): Cell {
    return new Cell(CellType.Fixed, value)
  }

  static createVariable(value: CellValue): Cell {
    return new Cell(CellType.Variable, value)
  }

  updateValue(value: CellValue): Cell {
    if (this.cellType === CellType.Fixed) {
      return this
    }
    return new Cell(CellType.Variable, value)
  }

  private constructor(readonly cellType: CellType, readonly value: CellValue) {}
}

export enum CellType {
  Fixed = 'Fixed',
  Variable = 'Variable',
}
