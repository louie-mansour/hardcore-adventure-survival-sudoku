import { Cell, CellType, CellValue, Sudoku } from "@/models/sudoku"
import { useEffect, useRef, useState } from "react"

interface Sudoku9x9GridProps {
  selectCell: (cell: [number, number]) => void
  selectedCell: [number, number] | null
  sudoku: Sudoku
  updateSudoku: (value: CellValue, row: number, col: number) => void
  hint: [number, number, CellValue] | null
  mistakes: [number, number, CellValue][]
  itemLocations: [string, number, number][]
}

interface Sudoku3x3GridProps {
  selectCell: (cell: [number, number]) => void
  selectedCell: [number, number] | null
  sudoku: Sudoku
  rows: [number, number, number]
  cols: [number, number, number]
  updateSudoku: (value: CellValue, row: number, col: number) => void
  hint: [number, number, CellValue] | null
  mistakes: [number, number, CellValue][]
  itemLocations: [string, number, number][]
  isMaskItems: boolean
}

interface SudokuCellProps {
  selectCell: (cell: [number, number]) => void
  selectedCell: [number, number] | null
  sudoku: Sudoku
  row: number
  col: number
  updateSudoku: (value: CellValue, row: number, col: number) => void
  hint: [number, number, CellValue] | null
  mistakes: [number, number, CellValue][]
  itemLocations: [string, number, number][]
  isMaskItems: boolean
} 

export default function Sudoku9x9Grid(props: Sudoku9x9GridProps) {
  const [isMaskItems, setIsMaskItems] = useState(false)
  const { sudoku, updateSudoku, hint, mistakes, selectCell, selectedCell, itemLocations } = props

  useEffect(() => {
    setIsMaskItems(false)
    setTimeout(() => { setIsMaskItems(true) }, 3000)
  }, [itemLocations])
  return (
    <div className='w-fit'>
    {
      <div>
        ❤️❤️
      </div>
    }
      <div className='grid' style={{
        gridTemplateRows: '8rem 8rem 8rem',
        gridTemplateColumns: '8rem 8rem 8rem',
      }}>
        <Sudoku3x3Grid selectedCell={selectedCell} selectCell={selectCell} sudoku={sudoku} rows={[0, 1, 2]} cols={[0, 1, 2]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} itemLocations={itemLocations} isMaskItems={isMaskItems}/>
        <Sudoku3x3Grid selectedCell={selectedCell} selectCell={selectCell} sudoku={sudoku} rows={[0, 1, 2]} cols={[3, 4, 5]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} itemLocations={itemLocations} isMaskItems={isMaskItems}/>
        <Sudoku3x3Grid selectedCell={selectedCell} selectCell={selectCell} sudoku={sudoku} rows={[0, 1, 2]} cols={[6, 7, 8]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} itemLocations={itemLocations} isMaskItems={isMaskItems}/>
        <Sudoku3x3Grid selectedCell={selectedCell} selectCell={selectCell} sudoku={sudoku} rows={[3, 4, 5]} cols={[0, 1, 2]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} itemLocations={itemLocations} isMaskItems={isMaskItems}/>
        <Sudoku3x3Grid selectedCell={selectedCell} selectCell={selectCell} sudoku={sudoku} rows={[3, 4, 5]} cols={[3, 4, 5]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} itemLocations={itemLocations} isMaskItems={isMaskItems}/>
        <Sudoku3x3Grid selectedCell={selectedCell} selectCell={selectCell} sudoku={sudoku} rows={[3, 4, 5]} cols={[6, 7, 8]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} itemLocations={itemLocations} isMaskItems={isMaskItems}/>
        <Sudoku3x3Grid selectedCell={selectedCell} selectCell={selectCell} sudoku={sudoku} rows={[6, 7, 8]} cols={[0, 1, 2]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} itemLocations={itemLocations} isMaskItems={isMaskItems}/>
        <Sudoku3x3Grid selectedCell={selectedCell} selectCell={selectCell} sudoku={sudoku} rows={[6, 7, 8]} cols={[3, 4, 5]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} itemLocations={itemLocations} isMaskItems={isMaskItems}/>
        <Sudoku3x3Grid selectedCell={selectedCell} selectCell={selectCell} sudoku={sudoku} rows={[6, 7, 8]} cols={[6, 7, 8]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} itemLocations={itemLocations} isMaskItems={isMaskItems}/>
      </div>
    </div>
  )
}

function Sudoku3x3Grid(props: Sudoku3x3GridProps) {
  const { sudoku, rows, cols, updateSudoku, hint, mistakes, selectCell, selectedCell, itemLocations, isMaskItems } = props
  return (
    <div className='grid border border-black grid-cols-3'>
      <SudokuCell selectedCell={selectedCell} selectCell={selectCell} sudoku={sudoku} row={rows[0]} col={cols[0]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} itemLocations={itemLocations} isMaskItems={isMaskItems} />
      <SudokuCell selectedCell={selectedCell} selectCell={selectCell} sudoku={sudoku} row={rows[0]} col={cols[1]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} itemLocations={itemLocations} isMaskItems={isMaskItems} />
      <SudokuCell selectedCell={selectedCell} selectCell={selectCell} sudoku={sudoku} row={rows[0]} col={cols[2]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} itemLocations={itemLocations} isMaskItems={isMaskItems} />
      <SudokuCell selectedCell={selectedCell} selectCell={selectCell} sudoku={sudoku} row={rows[1]} col={cols[0]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} itemLocations={itemLocations} isMaskItems={isMaskItems} />
      <SudokuCell selectedCell={selectedCell} selectCell={selectCell} sudoku={sudoku} row={rows[1]} col={cols[1]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} itemLocations={itemLocations} isMaskItems={isMaskItems} />
      <SudokuCell selectedCell={selectedCell} selectCell={selectCell} sudoku={sudoku} row={rows[1]} col={cols[2]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} itemLocations={itemLocations} isMaskItems={isMaskItems} />
      <SudokuCell selectedCell={selectedCell} selectCell={selectCell} sudoku={sudoku} row={rows[2]} col={cols[0]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} itemLocations={itemLocations} isMaskItems={isMaskItems} />
      <SudokuCell selectedCell={selectedCell} selectCell={selectCell} sudoku={sudoku} row={rows[2]} col={cols[1]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} itemLocations={itemLocations} isMaskItems={isMaskItems} />
      <SudokuCell selectedCell={selectedCell} selectCell={selectCell} sudoku={sudoku} row={rows[2]} col={cols[2]} updateSudoku={updateSudoku} hint={hint} mistakes={mistakes} itemLocations={itemLocations} isMaskItems={isMaskItems} />
    </div>
  )
}

function SudokuCell(props: SudokuCellProps) {
  const inputElement = useRef<HTMLInputElement>(null)
  const { sudoku, row, col, updateSudoku, hint, mistakes, selectCell, selectedCell, itemLocations, isMaskItems } = props
  const cell = sudoku.getCells()[row][col]

  if (inputElement.current) {
    inputElement.current.value = cell.value ?? ''
  }

  let backgroundColor = undefined
  if (mistakes.map(([r, c, _v]) => `${r}${c}`).includes(`${row}${col}`)) {
    backgroundColor = 'bg-red-500'
  } else if (hint && hint[0] === row && hint[1] === col) {
    backgroundColor = 'bg-green-500'
  } else if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
    backgroundColor = 'bg-blue-500'
  } else if (itemLocations.find(el => el[1] === row && el[2] === col)) {
    backgroundColor = 'bg-yellow-100'
  } else if (selectedCell && (selectedCell[0] === row || selectedCell[1] === col || (get3x3Range(selectedCell[0]).includes(row) && get3x3Range(selectedCell[1]).includes(col))))  {
    backgroundColor = 'bg-blue-100'
  }

  const item = itemLocations.find(el => el[1] === row && el[2] === col)?.[0]

  const textTransparency = isTransparentText(cell.value, item, isMaskItems) ? 'text-transparent' : 'text-black'

  // TODO: Ideally find a way to make the items fade to transparent
  return(
    <div className={`box-border border border-black flex items-center justify-center ${backgroundColor} ${textTransparency}`}>
      <input
        className={`w-8 h-8 border-0 outline-none text-center text-lg cursor-pointer ${cell.cellType === CellType.Fixed ? 'font-bold' : ''} ${backgroundColor}`}
        style={{ caretColor: 'transparent;'}}
        ref={inputElement}
        maxLength={1}
        type='text'
        onClick={() => selectCell([row, col])}
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
        onFocus={(e) => e.target.readOnly = true}
        readOnly={ cell.cellType === CellType.Fixed }
        defaultValue={ cell.value ?? '' }
        value={ cell.value ?? item}
      >
      </input>
    </div>
  )
}

function isTransparentText(cellValue: CellValue, item: string | undefined, isMaskItems: boolean): boolean {
  if (cellValue) {
    return false
  }
  if (item && isMaskItems) {
    return true
  }
  return false
}

function get3x3Range(rowOrCol: number): [number, number, number] {
  if (rowOrCol < 3) {
    return [0, 1, 2]
  }
  if (rowOrCol < 6) {
    return [3, 4, 5]
  }
  return [6, 7, 8]
}