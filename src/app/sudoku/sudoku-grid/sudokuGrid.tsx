import { CellType, CellValue, Sudoku } from "@/models/sudoku"
import { useEffect, useRef, useState } from "react"
import { createContext, useContext } from 'react';

interface Sudoku9x9GridProps {
  selectCell: (cell: [number, number]) => void
  selectedCell: [number, number] | null
  sudoku: Sudoku
  updateSudoku: (value: CellValue, row: number, col: number) => void
  hint: [number, number, CellValue] | null
  mistakes: [number, number, CellValue][]
  itemLocations: [string, number, number][]
  gameover: () => void
  hasLives: boolean
}

interface Sudoku3x3GridProps {
  rows: [number, number, number]
  cols: [number, number, number]
}

interface SudokuCellProps {
  row: number
  col: number
}

// TODO: Bit of a hack with the typing here
// setNumberOfLives might be best passed in as a prop
// isMaskItems might also be best passed in as a prop and determined via the Game model's state
const SudokuContext = createContext<Sudoku9x9GridProps & { decreaseLife: () => void, isMaskItems: boolean } | undefined>(undefined);

export default function Sudoku9x9Grid(props: Sudoku9x9GridProps) {
  const [isMaskItems, setIsMaskItems] = useState(false)
  const [numberOfLives, setNumberOfLives] = useState<number>(2)
  const { itemLocations, gameover, hasLives } = props

  useEffect(() => {
    if (!hasLives) return
    if (numberOfLives === 0) gameover()
  }, [numberOfLives, hasLives])

  useEffect(() => {
    setIsMaskItems(false)
    setTimeout(() => { setIsMaskItems(true) }, 3000) // TODO: Bug here where masked items flash when itemLocations changes frequently
  }, [itemLocations])

  return (
    <div className='w-fit'>
    { hasLives &&
      <div>
        {
          numberOfLives === 0 ? '☠️' : '❤️'.repeat(numberOfLives)
        }
      </div>
    }
      <div className='grid' style={{
        gridTemplateRows: '8.1rem 8.1rem 8.1rem',
        gridTemplateColumns: '8.1rem 8.1rem 8.1rem',
      }}>
        <SudokuContext.Provider value={{ ...props, decreaseLife, isMaskItems }} >
          <Sudoku3x3Grid rows={[0, 1, 2]} cols={[0, 1, 2]} />
          <Sudoku3x3Grid rows={[0, 1, 2]} cols={[3, 4, 5]} />
          <Sudoku3x3Grid rows={[0, 1, 2]} cols={[6, 7, 8]} />
          <Sudoku3x3Grid rows={[3, 4, 5]} cols={[0, 1, 2]} />
          <Sudoku3x3Grid rows={[3, 4, 5]} cols={[3, 4, 5]} />
          <Sudoku3x3Grid rows={[3, 4, 5]} cols={[6, 7, 8]} />
          <Sudoku3x3Grid rows={[6, 7, 8]} cols={[0, 1, 2]} />
          <Sudoku3x3Grid rows={[6, 7, 8]} cols={[3, 4, 5]} />
          <Sudoku3x3Grid rows={[6, 7, 8]} cols={[6, 7, 8]} />
        </SudokuContext.Provider>
      </div>
    </div>
  )

  function decreaseLife() {
    setNumberOfLives(l => l - 1)
  }
}

function Sudoku3x3Grid(props: Sudoku3x3GridProps) {
  const { rows, cols } = props
  return (
    <div className='grid border border-black grid-cols-3'>
      <SudokuCell row={rows[0]} col={cols[0]} />
      <SudokuCell row={rows[0]} col={cols[1]} />
      <SudokuCell row={rows[0]} col={cols[2]} />
      <SudokuCell row={rows[1]} col={cols[0]} />
      <SudokuCell row={rows[1]} col={cols[1]} />
      <SudokuCell row={rows[1]} col={cols[2]} />
      <SudokuCell row={rows[2]} col={cols[0]} />
      <SudokuCell row={rows[2]} col={cols[1]} />
      <SudokuCell row={rows[2]} col={cols[2]} />
    </div>
  )
}

function SudokuCell(props: SudokuCellProps) {
  const context = useContext(SudokuContext)!
  const { sudoku, updateSudoku, hint, mistakes, selectCell, selectedCell, itemLocations, isMaskItems, decreaseLife, hasLives } = context
  const { row, col } = props
  const [isError, setIsError] = useState(false)
  const cell = sudoku.getCells()[row][col]

  useEffect(() => { // TODO: This needs fixing
    if (mistakes.map(([r, c, _v]) => `${r}${c}`).includes(`${row}${col}`)) {
      setIsError(true)
      if (hasLives) {
        updateSudoku(null, row, col)
        decreaseLife()
      }
    } else  {
      if (hasLives) {
        setTimeout(() => setIsError(false), 3000)
        return
      }
      setIsError(false)
    }
  }, [mistakes])

  let backgroundColor = 'bg-transparent'
  if (hint && hint[0] === row && hint[1] === col) {
    backgroundColor = 'bg-green-500'
  } else if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
    backgroundColor = 'bg-blue-500'
  } else if (itemLocations.find(el => el[1] === row && el[2] === col)) {
    backgroundColor = 'bg-yellow-100'
  } else if (selectedCell && (selectedCell[0] === row || selectedCell[1] === col || (get3x3Range(selectedCell[0]).includes(row) && get3x3Range(selectedCell[1]).includes(col))))  {
    backgroundColor = 'bg-blue-100'
  }

  if (isError) {
    backgroundColor = 'bg-red-500 transition'
  }

  const item = itemLocations.find(el => el[1] === row && el[2] === col)?.[0]
  const textTransparency = isTransparentText(cell.value, item, isMaskItems) ? 'text-transparent' : 'text-black'
  const transitionColor = isError ? 'transition' : ''

  return (
    <div className={`box-border border border-black flex items-center justify-center ${backgroundColor} ${textTransparency} ${transitionColor}`}>
      <input
        className={`w-8 h-8 border-0 outline-none text-center text-lg cursor-pointer caret-transparent ${transitionColor} ${cell.cellType === CellType.Fixed ? 'font-bold' : ''} ${backgroundColor}`}
        maxLength={1}
        type='text'
        onClick={() => selectCell([row, col])}
        onKeyDown={(event) => {
          event.preventDefault();
          const key = event.key

          if (['Backspace', 'Delete'].includes(key)) {
            updateSudoku(null, row, col)
            return
          }

          if (/[0-9]/.test(key)) {
            updateSudoku(key.toString() as CellValue, row, col)
            return
          }
        }}
        onFocus={(e) => e.target.readOnly = true}
        readOnly={true}
        value={ cell.value ?? item ?? ''}
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