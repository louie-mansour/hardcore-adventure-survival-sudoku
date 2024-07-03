'use client'

import { MistakeError } from "@/errors/mistake";
import { EffectEmoji } from "@/models/effect";
import { ItemEmoji } from "@/models/item";
import { CellValue, Sudoku } from "@/models/sudoku";
import { useEffect, useState } from "react";
import { GameMode } from "../playarea/playArea";
import HintPanel from "../sudoku/hintPanel";
import Sudoku9x9Grid from "../sudoku/sudoku-grid/sudokuGrid";
import Toolbox from "../sudoku/toolbox";

interface SudokuAreaProps {
  initialSudoku: Sudoku
  gameMode: GameMode
  itemLocations: [string, number, number][],
  solveSudoku: () => void
  gameStart: () => void
  gameOver: () => void
  gameComplete: () => void
}

export default function SudokuArea(props: SudokuAreaProps) {
  const { initialSudoku, gameMode, itemLocations, solveSudoku, gameStart, gameOver, gameComplete } = props

  const [sudoku, setSudoku] = useState<Sudoku>(() => initialSudoku)
  const [selectedCell, setSelectedCell] = useState<[number, number]>([0, 0])
  const [notes, setNotes] = useState(() => initNotes())
  const [mistakes, setMistakes] = useState<[number, number, CellValue][]>([])
  const [isRevealMistakes, setIsRevealMistakes] = useState(false)
  const [hint, setHint] = useState<[number, number, CellValue] | null>(null)
  const [items, setItems] = useState(initItems(gameMode))
  const [enabledItem, setEnabledItem] = useState<string>()
  const [numberOfShields, setNumberOfShields] = useState(0)
  const [emojiLocations, setEmojiLocations] = useState<[ItemEmoji, number, number][]>([])

  useEffect(() => {
    if(sudoku.isSolved()) {
      // gameComplete()
      return
    }
    gameStart() // TODO: This constantly puts the game into inProgress mode. There's probably a better way of doing thiss
  }, [sudoku])

  useEffect(() => {
    reset()
  }, [initialSudoku])

  useEffect(() => {
    setItems(initItems(gameMode))
  }, [gameMode])

  return (
    <>
      <div className='flex flex-col justify-center items-center'>
        <Sudoku9x9Grid
          selectedCell={selectedCell}
          selectCell={selectCell}
          sudoku={sudoku}
          hint={hint}
          mistakes={isRevealMistakes ? mistakes : []}
          itemLocations={itemLocations}
          gameover={gameOver}
          notes={notes}
          putValueInCell={putValueInCell}
          numberOfShields={numberOfShields}
          emojiLocations={emojiLocations}
        />
      </div>
      <Toolbox
        putValueInCell={putValueInCell}
        items={items}
        useItem={useItem}
        enabledItem={enabledItem}
      />
      <HintPanel
        isFoundMistakes={gameMode === GameMode.OngoingHints ? false : mistakes.length > 0}
        isFoundHint={!!hint}
        gameMode={gameMode}
      />
    </>
  )

  function reset() {
    setSudoku(initialSudoku)
    setNotes(initNotes())
    setMistakes([])
    setIsRevealMistakes(false)
    setHint(null)
    setItems(initItems(gameMode))
    setEnabledItem(undefined)
  }

  function updateSudoku(value: CellValue, row: number, col: number) {
    switch (gameMode) {
      case GameMode.Hardcore: return updateSudokuHardcoreBehaviour(value, row, col)
      case GameMode.OngoingHints: return updateSudokuOngoingHintsBehaviour(value, row, col)
      case GameMode.Normal: return updateSudokuNormalBehaviour(value, row, col)
    }
  }

  function putEmoji(emoji: ItemEmoji, row: number, col: number) {
    setEmojiLocations(e => {
      return [[emoji, row, col], ...e]
    })
  }

  function updateSudokuHardcoreBehaviour(value: CellValue, row: number, col: number) {
    setSudoku(s => {
      const newSudoku = s.updateCell(value, row, col)
      const mistakes = newSudoku.findMistakes()

      if (mistakes.length > 0) {
        setMistakes(mistakes)
        setIsRevealMistakes(true)
        // TODO: This is fine but not ideal
        // Ideally the model methods are immutable and we can just return s
        // Until then, this workaround will work without issues
        return s.updateCell(null, row, col)
      }

      const itemLocation = itemLocations.find(el => el[1] === row && el[2] === col)
      if (value && itemLocation) {
        setItems(i => [...new Set([...i, itemLocation[0]])])
      }
      return newSudoku

    })
  }

  function updateSudokuOngoingHintsBehaviour(value: CellValue, row: number, col: number) {
    setSudoku(s => {
      const newSudoku = s.updateCell(value, row, col)
      const mistakes = newSudoku.findMistakes()
  
      if (mistakes.length === 0) {
        return newSudoku
      }
      setMistakes(mistakes)
      setIsRevealMistakes(true)
      setHint(newSudoku.getHint({ allowMistakes: true }))
      return s
    })
  }

  function updateSudokuNormalBehaviour(value: CellValue, row: number, col: number) {
    setSudoku(s => {
      const newSudoku = s.updateCell(value, row, col)

      setHint(h => {
        if (h && h[0] === row && h[1] === col) {
          return null
        }
        return h
      })
      setMistakes(m => {
        if (!m.map(m => `${m[0]}${m[1]}`).includes(`${row}${col}`)) {
          return m
        }
        
        const newMistakes = m.filter(m => m[0] !== row || m[1] !== col)
        if (newMistakes.length === 0) {
          setIsRevealMistakes(false)
        }
        return newMistakes
      })

      return newSudoku
    })
  }

  function getHint() {
    try {
      setHint(sudoku.getHint())
    } catch (err: unknown) {
      if (err instanceof MistakeError) {
        setMistakes(err.mistakes)
      }
    }
  }

  function revealHint() {
    const revealedHint = sudoku.revealHint()
    const newSudoku = sudoku.updateCell(revealedHint[2], revealedHint[0], revealedHint[1])
    setSudoku(newSudoku)

    if (gameMode === GameMode.OngoingHints) {
      setMistakes(newSudoku.findMistakes())
      setHint(newSudoku.getHint({ allowMistakes: true }))
      return
    }

    setHint(null)
  }

  function selectCell(cell: [number, number]) {
    setSelectedCell(cell)
  }

  function putValueInCell(value: CellValue) {
    if (enabledItem === '✏️') {
      toggleNoteValue(selectedCell[0], selectedCell[1], value)
    } else {
      updateSudoku(value, selectedCell[0], selectedCell[1])
    }
  }

  function initNotes(): Set<CellValue>[][] {
    return Array.from(
      { length: 9 }, _r => Array.from(
        { length: 9 }, _c => new Set<CellValue>([])
      )
    )
  }

  function toggleNoteValue(row: number, col: number, noteValue: CellValue) {
    if (notes[row][col].has(noteValue)) {
      notes[row][col].delete(noteValue)
    } else {
      notes[row][col].add(noteValue)
    }
    setNotes([...notes])
  }

  function chooseEnabledItem(item: string) {
    setEnabledItem(i => {
      if (item === i) {
        return undefined
      }
      return item
    })
  }

  function useItem(value: string) {
    const row = selectedCell[0]
    const col = selectedCell[1]
    switch (value) {
      case '🗑️': return updateSudoku(null,row, col)
      case '✏️': return chooseEnabledItem('✏️')
      case '🔍': {
        if (mistakes.length > 0) {
          return setIsRevealMistakes(true)
        }
        if (hint) {
          return revealHint()
        }
      }
      case '🍼':
        getHint()
        return revealHint()
      case '🏳️':
        return solveSudoku()
      case '🔮':
        return getHint()
      case '🪄':
        return updateSudoku(sudoku.solved[row][col].value, row, col)
      case '🛡️':
        return increaseNumberOfShields()
      case '🌱':
        putEmoji(ItemEmoji.Plant, row, col)
        setTimeout(() => { // TODO: Promises with await or then would be nicer
          putEmoji(ItemEmoji.PlantMedium, row, col)
          setTimeout(() => {
            putEmoji(ItemEmoji.PlantLarge, row, col)
            setTimeout(() => updateSudoku(sudoku.solved[row][col].value, row, col), 5000)
          }, 5000)
        }, 5000)
        return
      default:
        return alert('Not implemented yet')
    }
  }

  function initItems(gameMode: GameMode): string[] {
    if (gameMode === GameMode.Hardcore) {
      return ['🗑️', '✏️', '🧯', '🍼', '🏳️', '🛡️', '🪄', '🔮', '🔦', '☀️', '🌱', '❄️', '🚒', '🧀', '🖐️']
    }
    if (gameMode === GameMode.OngoingHints) {
      return ['🗑️', '✏️', '🍼', '🏳️']
    }
    return [ '🗑️', '✏️', '🔍', '🏳️']
  }

  function increaseNumberOfShields() {
    setNumberOfShields(s => {
      return s + 1
    })
  }
}
