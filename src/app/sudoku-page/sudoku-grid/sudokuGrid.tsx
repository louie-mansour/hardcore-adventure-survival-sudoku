import { CellType, CellValue, Sudoku } from "@/models/Sudoku"
import { useRef } from "react"

interface Sudoku9x9GridProps {
  sudoku: Sudoku
  updateSudoku: (value: CellValue, row: number, col: number) => void
  hint: [number, number, CellValue] | null
  mistakes: [number, number, CellValue][]
}

interface Sudoku3x3GridProps {
  sudoku: Sudoku
  rows: [number, number, number]
  cols: [number, number, number]
  updateSudoku: (value: CellValue, row: number, col: number) => void
  hint: [number, number, CellValue] | null
  mistakes: [number, number, CellValue][]
}

interface SudokuCellProps {
  sudoku: Sudoku
  row: number
  col: number
  updateSudoku: (value: CellValue, row: number, col: number) => void
  hint: [number, number, CellValue] | null
  mistakes: [number, number, CellValue][]
} 

export default function Sudoku9x9Grid(props: Sudoku9x9GridProps) {
  const { sudoku, updateSudoku, hint, mistakes } = props
  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: '150px 150px 150px',
      gridTemplateColumns: '150px 150px 150px',
    }}>
      <Sudoku3x3Grid sudoku={sudoku} rows={[0, 1, 2]} cols={[0, 1, 2]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} />
      <Sudoku3x3Grid sudoku={sudoku} rows={[0, 1, 2]} cols={[3, 4, 5]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} />
      <Sudoku3x3Grid sudoku={sudoku} rows={[0, 1, 2]} cols={[6, 7, 8]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} />
      <Sudoku3x3Grid sudoku={sudoku} rows={[3, 4, 5]} cols={[0, 1, 2]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} />
      <Sudoku3x3Grid sudoku={sudoku} rows={[3, 4, 5]} cols={[3, 4, 5]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} />
      <Sudoku3x3Grid sudoku={sudoku} rows={[3, 4, 5]} cols={[6, 7, 8]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} />
      <Sudoku3x3Grid sudoku={sudoku} rows={[6, 7, 8]} cols={[0, 1, 2]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} />
      <Sudoku3x3Grid sudoku={sudoku} rows={[6, 7, 8]} cols={[3, 4, 5]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} />
      <Sudoku3x3Grid sudoku={sudoku} rows={[6, 7, 8]} cols={[6, 7, 8]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} />
    </div>
  )
}

function Sudoku3x3Grid(props: Sudoku3x3GridProps) {
  const { sudoku, rows, cols, updateSudoku, hint, mistakes } = props
  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: '50px 50px 50px',
      gridTemplateColumns: '50px 50px 50px',
      border: 'black 1px solid',
      boxSizing: 'border-box',
    }}>
      <SudokuCell sudoku={sudoku} row={rows[0]} col={cols[0]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} />
      <SudokuCell sudoku={sudoku} row={rows[0]} col={cols[1]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} />
      <SudokuCell sudoku={sudoku} row={rows[0]} col={cols[2]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} />
      <SudokuCell sudoku={sudoku} row={rows[1]} col={cols[0]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} />
      <SudokuCell sudoku={sudoku} row={rows[1]} col={cols[1]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} />
      <SudokuCell sudoku={sudoku} row={rows[1]} col={cols[2]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} />
      <SudokuCell sudoku={sudoku} row={rows[2]} col={cols[0]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} />
      <SudokuCell sudoku={sudoku} row={rows[2]} col={cols[1]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} />
      <SudokuCell sudoku={sudoku} row={rows[2]} col={cols[2]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} />
    </div>
  )
}

function SudokuCell(props: SudokuCellProps) {
  const inputElement = useRef<HTMLInputElement>(null)
  const { sudoku, row, col, updateSudoku, hint, mistakes } = props
  const cell = sudoku.cells[row][col]
  
  if (inputElement.current) {
    inputElement.current.value = cell.value ?? ''
  }

  let backgroundColor = undefined
  if (mistakes.map(([r, c, _v]) => `${r}${c}`).includes(`${row}${col}`)) {
    backgroundColor = 'red'
  } else if (hint && hint[0] === row && hint[1] === col) {
    backgroundColor = 'green'
  }

  return(
    <div style={{
      border: 'black 1px solid',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: backgroundColor

    }}>
      <input
        ref={inputElement}
        maxLength={1}
        type='text'
        onKeyDown={(event) => {
          const key = event.key

          if (['Backspace', 'Delete'].includes(key)) {
            updateSudoku(null, row, col)
            return
          }

          if (/[0-9]/.test(key)) {
            updateSudoku(key.toString() as CellValue, row, col)
            return
          }
          event.preventDefault();
        }}
        readOnly={ cell.cellType === CellType.Fixed }
        defaultValue={ cell.value ?? '' }
        value={ cell.cellType === CellType.Fixed ? cell.value ?? undefined : undefined }
        style={{
          width: '40px',
          height: '40px',
          border:0,
          outline:0,
          textAlign: 'center',
          fontWeight: cell.cellType === CellType.Fixed ? 1000 : 400,
          }}>
      </input>
    </div>
  )
}