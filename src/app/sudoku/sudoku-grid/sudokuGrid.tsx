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
  notes: Set<CellValue>[][]
  toggleNoteValue: ((row: number, col: number, cellValue: CellValue) =>  void) | undefined
  numberOfShields: number
}

interface Sudoku3x3GridProps {
  rows: [number, number, number]
  cols: [number, number, number]
}

interface SudokuCellProps {
  row: number
  col: number
}

interface NoteCellProps {
  note: CellValue
  backgroundColor: string
}

// TODO: Bit of a hack with the typing here
// setNumberOfLives might be best passed in as a prop
// isMaskItems might also be best passed in as a prop and determined via the Game model's state
const SudokuContext = createContext<Sudoku9x9GridProps & { decreaseLife: () => void, isMaskItems: boolean } | undefined>(undefined);

export default function Sudoku9x9Grid(props: Sudoku9x9GridProps) {
  const [isMaskItems, setIsMaskItems] = useState(false)
  const [numberOfLives, setNumberOfLives] = useState<number | null>(2)
  const { itemLocations, gameover, numberOfShields } = props
  const maskTimeoutId = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (numberOfLives === 0) {
      gameover()
    }
  }, [numberOfLives])

  useEffect(() => {
    setIsMaskItems(false)
    clearTimeout(maskTimeoutId.current)
    maskTimeoutId.current = setTimeout(() => { setIsMaskItems(true) }, 3000)
  }, [itemLocations])

  return (
    <div className='w-fit'>
    { numberOfLives !== null &&
      <div>
        {
          numberOfLives === 0 ? '☠️' : '❤️'.repeat(numberOfLives)
        }
        {
          '🛡️'.repeat(numberOfShields)
        }
      </div>
    }
      <div className='grid'
        style={{
          gridTemplateRows: '7.1rem 7.1rem 7.1rem', // TODO: The sizes aren't correct - need to revisit this to make it better
          gridTemplateColumns: '7.1rem 7.1rem 7.1rem',
        }}
      >
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
    setNumberOfLives(l => {
      if (l === null) {
        return null
      }
      if (l > 0) {
        return l - 1
      }
      return 0
    })
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
  const { sudoku, updateSudoku, hint, mistakes, selectCell, selectedCell, itemLocations, isMaskItems, decreaseLife, notes, toggleNoteValue } = context
  const { row, col } = props
  const [isError, setIsError] = useState(false)
  const cell = sudoku.getCells()[row][col]
  const errorSetTimeoutId = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!mistakes.map(([r, c, _v]) => `${r}${c}`).includes(`${row}${col}`)) {
      return
    }

    setIsError(true)
    clearTimeout(errorSetTimeoutId.current)
    errorSetTimeoutId.current = setTimeout(() => { setIsError(false) }, 3000)
    decreaseLife()
  }, [mistakes])

  const backgroundColor = determineBackgroundColor()
  const item = itemLocations.find(el => el[1] === row && el[2] === col)?.[0]
  const textTransparency = isTransparentText(cell.value, item, isMaskItems) ? 'text-transparent' : 'text-black'
  const notesInCell = notes[row][col]

  return (
    <div className="m-0 p-0 w-9 h-9">
      { (cell.value || (item && !isMaskItems)) ?
        <div className={`absolute box-border border border-black flex items-center justify-center ${backgroundColor} ${textTransparency}`}>
          <input
            className={`w-9 h-9 border-0 outline-none text-center text-lg cursor-pointer caret-transparent ${cell.cellType === CellType.Fixed ? 'font-bold' : ''} ${backgroundColor}`}
            maxLength={1}
            type='text'
            onClick={() => selectCell([row, col])}
            onKeyDown={e => onKeyDownEvent(e)}
            onFocus={(e) => e.target.readOnly = true}
            readOnly={true}
            value={ cell.value ?? item ?? ''}
          >
          </input>
        </div>
      :
      <div className='grid grid-cols-3 absolute box-border border border-black cursor-pointer items-center justify-center'
        tabIndex={-1}
        onClick={() => selectCell([row, col])}
        onKeyDown={e => onKeyDownEvent(e)}
      >
        {
          (['1', '2', '3', '4', '5', '6', '7', '8', '9'] as CellValue[]).map(el => {
            return <NoteCell key={el} note={notesInCell.has(el) ? el : null} backgroundColor={backgroundColor} />
          })
        }
      </div>
      }

    </div>
  )

  function onKeyDownEvent(event: any) {
    event.preventDefault();
    const key = event.key

    let value: CellValue | null
    if (['Backspace', 'Delete'].includes(key)) {
      value = null
    } else if (/[0-9]/.test(key)) {
      value = key.toString() as CellValue
    } else {
      return
    }

    if (toggleNoteValue) {
      return toggleNoteValue(row, col, value)
    }
    return updateSudoku(key.toString() as CellValue, row, col)
  }

  function determineBackgroundColor(): string {
    if (isError) {
      return 'bg-red-500'
    }
    if (hint && hint[0] === row && hint[1] === col) {
      return 'bg-green-500'
    }
    if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
      return 'bg-blue-500'
    }
    if (itemLocations.find(el => el[1] === row && el[2] === col)) {
      return 'bg-yellow-100'
    }
    if (selectedCell && (selectedCell[0] === row || selectedCell[1] === col || (get3x3Range(selectedCell[0]).includes(row) && get3x3Range(selectedCell[1]).includes(col))))  {
      return 'bg-blue-100'
    }
    return 'bg-transparent'
  }
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

  function NoteCell(props: NoteCellProps) {
    const { note, backgroundColor } = props
    return (
      <div className={`w-3 h-3 items-center text-center align-middle text-xs pointer-events-none ${backgroundColor}`} > 
        { note }
      </div>
    )
  }
}