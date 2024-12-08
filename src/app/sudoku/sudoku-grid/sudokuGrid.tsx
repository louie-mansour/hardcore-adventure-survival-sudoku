import { NegativeEffect, NegativeEffectEmoji } from "@/models/effect";
import { Item, ItemEmoji } from "@/models/item";
import { CellType, CellValue, Sudoku } from "@/models/sudoku"
import { useEffect, useRef, useState, Dispatch } from "react"
import { createContext, useContext } from 'react';

interface Sudoku9x9GridProps {
  selectCell: (cell: [number, number]) => void
  selectedCell: [number, number] | null
  sudoku: Sudoku
  hint: [number, number, CellValue] | null
  mistakes: Map<number, [number, number, CellValue]>
  emojiLocations: [Item | NegativeEffect, number, number, boolean][]
  gameover: () => void
  notes: Set<CellValue>[][]
  putValueInCell: ((cellValue: CellValue) =>  void)
  numberOfShields: number
  placedItemLocations: [ItemEmoji, number, number][]
  placedEffectLocations: [NegativeEffectEmoji, number, number][]
}

interface Sudoku3x3GridProps {
  rows: [number, number, number]
  cols: [number, number, number]
  mistakes: Map<number, [number, number, CellValue]>
}

interface SudokuCellProps {
  row: number
  col: number
  mistakes: Map<number, [number, number, CellValue]>
}

const STARTNG_LIVES = 5

// TODO: Bit of a hack with the typing here
// setNumberOfLives might be best passed in as a prop
// isMaskItems might also be best passed in as a prop and determined via the Game model's state
const SudokuContext = createContext<
Sudoku9x9GridProps & {
  decreaseLife: (mistakes: Map<number, [number, number, CellValue]>) => void,
  isMaskItems: boolean,
  displayedErrors: Map<number, [number, number, CellValue]>,
  setDisplayedErrors: any
} | undefined>(undefined);

export default function Sudoku9x9Grid(props: Sudoku9x9GridProps) {
  const [isMaskItems, setIsMaskItems] = useState(false)
  const [displayedErrors, setDisplayedErrors] = useState<Map<number, [number, number, CellValue]>>(new Map())
  const [numberOfLives, setNumberOfLives] = useState<number | null>(STARTNG_LIVES)
  const { emojiLocations, gameover, numberOfShields, mistakes } = props
  const maskStRef = useRef<NodeJS.Timeout>()

  // useEffect(() => {
    if (numberOfLives === 0) gameover()
  // }, [numberOfLives, gameover])

  useEffect(() => {
    if (maskStRef.current) {
      clearTimeout(maskStRef.current)
    }

    setIsMaskItems(false)
    maskStRef.current = setTimeout(() => { setIsMaskItems(true) }, 3000)
  }, [emojiLocations])

  return (
    <div className='w-fit'>
    { numberOfLives !== null &&
      <div>
        {
          numberOfLives === 0 ? '☠️' : '❤️'.repeat(numberOfLives)
        }
        {
          '🛡️'.repeat(numberOfShields || 0)
        }
      </div>
    }
      <div className='grid'
        style={{
          gridTemplateRows: '7.1rem 7.1rem 7.1rem', // TODO: The sizes aren't correct - need to revisit this to make it better
          gridTemplateColumns: '7.1rem 7.1rem 7.1rem',
        }}
      >
        <SudokuContext.Provider value={{ ...props, decreaseLife, isMaskItems, displayedErrors, setDisplayedErrors }} >
          <Sudoku3x3Grid rows={[0, 1, 2]} cols={[0, 1, 2]} mistakes={mistakes} />
          <Sudoku3x3Grid rows={[0, 1, 2]} cols={[3, 4, 5]} mistakes={mistakes} />
          <Sudoku3x3Grid rows={[0, 1, 2]} cols={[6, 7, 8]} mistakes={mistakes} />
          <Sudoku3x3Grid rows={[3, 4, 5]} cols={[0, 1, 2]} mistakes={mistakes} />
          <Sudoku3x3Grid rows={[3, 4, 5]} cols={[3, 4, 5]} mistakes={mistakes} />
          <Sudoku3x3Grid rows={[3, 4, 5]} cols={[6, 7, 8]} mistakes={mistakes} />
          <Sudoku3x3Grid rows={[6, 7, 8]} cols={[0, 1, 2]} mistakes={mistakes} />
          <Sudoku3x3Grid rows={[6, 7, 8]} cols={[3, 4, 5]} mistakes={mistakes} />
          <Sudoku3x3Grid rows={[6, 7, 8]} cols={[6, 7, 8]} mistakes={mistakes} />
        </SudokuContext.Provider>
      </div>
    </div>
  )

  function decreaseLife(mistakes: Map<number, [number, number, CellValue]>) {
    setNumberOfLives(l => {
      // if (l === null) {
      //   return null
      // }
      if (l === 0) {
        return 0
      }
      return STARTNG_LIVES - mistakes.size
    })
  }
}

function Sudoku3x3Grid(props: Sudoku3x3GridProps) {
  const { rows, cols, mistakes } = props
  return (
    <div className='grid border border-black grid-cols-3'>
      <SudokuCell row={rows[0]} col={cols[0]} mistakes={mistakes} />
      <SudokuCell row={rows[0]} col={cols[1]} mistakes={mistakes} />
      <SudokuCell row={rows[0]} col={cols[2]} mistakes={mistakes} />
      <SudokuCell row={rows[1]} col={cols[0]} mistakes={mistakes} />
      <SudokuCell row={rows[1]} col={cols[1]} mistakes={mistakes} />
      <SudokuCell row={rows[1]} col={cols[2]} mistakes={mistakes} />
      <SudokuCell row={rows[2]} col={cols[0]} mistakes={mistakes} />
      <SudokuCell row={rows[2]} col={cols[1]} mistakes={mistakes} />
      <SudokuCell row={rows[2]} col={cols[2]} mistakes={mistakes} />
    </div>
  )
}

function SudokuCell(props: SudokuCellProps) {
  const context = useContext(SudokuContext)!
  const { sudoku, hint, selectCell, selectedCell, emojiLocations, isMaskItems, decreaseLife, notes, putValueInCell, placedItemLocations, placedEffectLocations, displayedErrors, setDisplayedErrors } = context
  const { row, col, mistakes } = props
  const [isError, setIsError] = useState(false)
  const cell = sudoku.getCells()[row][col]
  const errorStRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const nonDisplayedMistakes = [...mistakes].filter(m => !displayedErrors.get(m[0]))
    const rcMistake = [ ...nonDisplayedMistakes ].find(([_now, [r, c, _cellValue]]) => `${r}${c}` === `${row}${col}`)
    if (rcMistake) {
      setIsError(true)
      errorStRef.current = setTimeout(() => { setIsError(false) }, 3000)
      setDisplayedErrors((e: Map<number, [number, number, CellValue]>) => { return e.set(rcMistake[0], rcMistake[1]) })
      decreaseLife(mistakes) // TODO: Maybe this should be done at a higher level, take away a life if there's a mistake
    }
  }, undefined)

  const backgroundColor = determineBackgroundColor()

  const emoji = emojiLocations.find(el => el[1] === row && el[2] === col)?.[0]
  const placedItem = placedItemLocations.find(el => el[1] === row && el[2] === col)?.[0]
  const placedEffect = placedEffectLocations.find(el => el[1] === row && el[2] === col)?.[0]
  const textTransparency = isTransparentText(cell.value, emoji, isMaskItems, placedItem) ? 'text-transparent' : 'text-black'

  const notesInCell = notes[row][col]

  return (
    <div
      className="m-0 p-0 w-9 h-9">
      { (cell.value || (emoji && !isMaskItems)) || placedItem || placedEffect?
        <div className={`absolute box-border border border-black flex items-center justify-center ${backgroundColor} ${textTransparency}`}>
          <input
            className={`w-9 h-9 border-0 outline-none text-center text-lg cursor-pointer caret-transparent ${cell.cellType === CellType.Fixed ? 'font-bold' : ''} ${backgroundColor}`}
            maxLength={1}
            type='text'
            onClick={() => selectCell([row, col])}
            tabIndex={-1}
            onKeyDown={onKeyDownEvent} // TODO: A problem with this keyDownEvent or the one below. It doesn't register until after a few clicks
            onFocus={(e) => e.target.readOnly = true}
            readOnly={true}
            value={ placedEffect ?? cell.value ?? placedItem ?? emoji?.emoji ?? ''}
          >
          </input>
        </div>
      :
      <div className='grid grid-cols-3 absolute box-border border border-black cursor-pointer items-center justify-center'
        tabIndex={-1}
        onClick={() => selectCell([row, col])}
        onKeyDown={onKeyDownEvent}
      >
        <NoteCell note={notesInCell.has('1') ? '1' : null} backgroundColor={backgroundColor} />
        <NoteCell note={notesInCell.has('2') ? '2' : null} backgroundColor={backgroundColor} />
        <NoteCell note={notesInCell.has('3') ? '3' : null} backgroundColor={backgroundColor} />
        <NoteCell note={notesInCell.has('4') ? '4' : null} backgroundColor={backgroundColor} />
        <NoteCell note={notesInCell.has('5') ? '5' : null} backgroundColor={backgroundColor} />
        <NoteCell note={notesInCell.has('6') ? '6' : null} backgroundColor={backgroundColor} />
        <NoteCell note={notesInCell.has('7') ? '7' : null} backgroundColor={backgroundColor} />
        <NoteCell note={notesInCell.has('8') ? '8' : null} backgroundColor={backgroundColor} />
        <NoteCell note={notesInCell.has('9') ? '9' : null} backgroundColor={backgroundColor} />
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
    putValueInCell(value)
    // This is a hack. I don't know why this works but selecting the cell causes a re-render.
    // Without selecting the cell, the re-render doesn't happen and the mistakes are shown after the next click
    selectCell([row, col]) 
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
    if (selectedCell && (selectedCell[0] === row || selectedCell[1] === col || (get3x3Range(selectedCell[0]).includes(row) && get3x3Range(selectedCell[1]).includes(col))))  {
      return 'bg-blue-100'
    }
    return 'bg-transparent'
  }
}

function isTransparentText(cellValue: CellValue, emoji: Item | NegativeEffect | undefined, isMaskItems: boolean, placedItem: string | undefined): boolean {
  if (cellValue || emoji || placedItem) {
    return false
  }
  if (emoji && isMaskItems) {
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

interface NoteCellProps {
  note: CellValue
  backgroundColor: string
}

function NoteCell(props: NoteCellProps) {
  const { note, backgroundColor } = props
  return (
    <div className={`w-3 h-3 items-center text-center align-middle text-xs pointer-events-none ${backgroundColor}`} > 
      { note }
    </div>
  )
}
