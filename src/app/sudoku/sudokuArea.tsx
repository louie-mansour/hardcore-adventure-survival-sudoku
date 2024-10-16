'use client'

import { MODE } from "@/consts";
import { MistakeError } from "@/errors/mistake";
import { NegativeEffect, NegativeEffectEmoji } from "@/models/effect";
import { Item, ItemEmoji, ItemName } from "@/models/item";
import { CellValue, Sudoku } from "@/models/sudoku";
import { useEffect, useState } from "react";
import { GameMode } from "../playarea/playArea";
import Sudoku9x9Grid from "../sudoku/sudoku-grid/sudokuGrid";
import Toolbox from "../sudoku/toolbox";

interface SudokuAreaProps {
  initialSudoku: Sudoku
  gameMode: GameMode
  itemLocations: [Item, number, number][],
  negativeEffectLocations: [NegativeEffect, number, number][],
  solveSudoku: () => void
  gameStart: () => void
  gameOver: () => void
  gameComplete: () => void
}

export default function SudokuArea(props: SudokuAreaProps) {
  const { initialSudoku, gameMode, itemLocations, negativeEffectLocations, solveSudoku, gameStart, gameOver, gameComplete } = props

  const [sudoku, setSudoku] = useState<Sudoku>(() => initialSudoku)
  const [selectedCell, setSelectedCell] = useState<[number, number]>([0, 0])
  const [notes, setNotes] = useState(() => initNotes())
  const [mistakes, setMistakes] = useState<[number, number, CellValue][]>([])
  const [isRevealMistakes, setIsRevealMistakes] = useState(false)
  const [hint, setHint] = useState<[number, number, CellValue] | null>(null)
  const [items, setItems] = useState(initItems())
  const [placedItemLocations, setPlacedItemLocations] = useState<[ItemEmoji, number, number][]>([])
  const [effects, setEffects] = useState<NegativeEffectEmoji[]>(initEffects())
  const [placedEffectLocations, setPlacedEffectLocations] = useState<[NegativeEffectEmoji, number, number][]>([])
  const [enabledItem, setEnabledItem] = useState<Item | undefined>()
  const [numberOfShields, setNumberOfShields] = useState(0)
  let fireQueue: [number, number][] = []

  useEffect(() => {
    if(sudoku.isSolved()) {
      // gameComplete()
      return
    }
    // gameStart() // TODO: This constantly puts the game into inProgress mode. There's probably a better way of doing thiss
  }, [sudoku, gameStart, gameComplete])

  useEffect(() => {
    reset()

    function reset() {
      setSudoku(initialSudoku)
      setNotes(initNotes())
      setMistakes([])
      setIsRevealMistakes(false)
      setHint(null)
      setItems(initItems())
      setEnabledItem(undefined)
    }
  }, [initialSudoku])

  useEffect(() => {
    setItems(initItems())
  }, [])

  return (
    <div className='flex flex-col justify-center items-center gap-3'>
      {/* <div className='flex flex-col justify-center items-center'> */}
        <Sudoku9x9Grid
          selectedCell={selectedCell}
          selectCell={selectCell}
          sudoku={sudoku}
          hint={hint}
          mistakes={isRevealMistakes ? mistakes : []}
          emojiLocations={itemLocations}
          gameover={gameOver}
          notes={notes}
          putValueInCell={putValueInCell}
          numberOfShields={numberOfShields}
          placedItemLocations={placedItemLocations}
          placedEffectLocations={placedEffectLocations}
        />
      {/* </div> */}
      <Toolbox
        putValueInCell={putValueInCell}
        items={items}
        utilizeItem={utilizeItem}
        enabledItem={enabledItem}
        effects={effects}
        enableEffect={enableEffect}
      />
    </div>
  )

  function placeItem(emoji: ItemEmoji, row: number, col: number) {
    setPlacedItemLocations(e => {
      return [[emoji, row, col], ...e]
    })
  }

  function placeEffect(emoji: NegativeEffectEmoji, row: number, col: number) {
    setPlacedEffectLocations(e => {
      return [[emoji, row, col], ...e]
    })
  }

  function updateSudoku(value: CellValue, row: number, col: number) {
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

  function getHint() {
    try {
      setHint(sudoku.getHint())
    } catch (err: unknown) {
      if (err instanceof MistakeError) {
        setMistakes(err.mistakes)
      }
    }
  }

  function selectCell(cell: [number, number]) {
    setSelectedCell(cell)
  }

  function putValueInCell(value: CellValue) {
    if (enabledItem?.name === ItemName.Note) {
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

  function chooseEnabledItem(item: Item) {
    setEnabledItem(i => {
      if (item.name === i?.name) {
        return undefined
      }
      return item
    })
  }

  function utilizeItem(item: Item) {
    const row = selectedCell[0]
    const col = selectedCell[1]
    if (!item.use()) {
      return
    }
    switch (item.name) {
      case ItemName.Note: return chooseEnabledItem(item)
      case ItemName.CrystalBall:
        return getHint()
      case ItemName.MagicWand:
        return updateSudoku(sudoku.solved[row][col].value, row, col)
      case ItemName.Shield:
        return increaseNumberOfShields()
      case ItemName.Plant:
        placeItem(ItemEmoji.Plant, row, col)
        setTimeout(() => { // TODO: Promises with await/then would be nicer
          placeItem(ItemEmoji.PlantMedium, row, col)
          setTimeout(() => {
            placeItem(ItemEmoji.PlantLarge, row, col)
            setTimeout(() => updateSudoku(sudoku.solved[row][col].value, row, col), 5000)
          }, 5000)
        }, 5000)
        return
      case ItemName.FireExtinguisher:
        enableExtinguisher(NegativeEffectEmoji.ExtinguishingSpraySmall, row, col)
        setTimeout(() => { // TODO: Promises with await/then would be nicer
          enableExtinguisher(NegativeEffectEmoji.ExtinguishingSprayMedium, row, col)
          setTimeout(() => {
            enableExtinguisher(NegativeEffectEmoji.ExtinguishingSprayLarge, row, col)
            setTimeout(() => {
              enableExtinguisher(NegativeEffectEmoji.ExtinguishingSpray, row, col)
              setTimeout(() => endExtinguisher(row, col), 300)
            }, 100)
          }, 100)
        }, 100)
        return
      default:
        return alert('Not implemented yet')
    }
  }

  function initItems(): Item[] {
    if (MODE === 'DEVELOPER') {
      return [
        Item.factory(ItemName.FireExtinguisher),
        Item.factory(ItemName.Shield),
        Item.factory(ItemName.MagicWand),
        Item.factory(ItemName.CrystalBall),
        Item.factory(ItemName.GameDie),
      ]
    }
    return [Item.factory(ItemName.Note)]
  }

  function increaseNumberOfShields() {
    setNumberOfShields(s => {
      return s + 1
    })
  }

  function initEffects(): NegativeEffectEmoji[] {
    if (MODE === 'DEVELOPER') {
      return ['🔥', '🐢', '🌋', '🌑', '🪞', '🐀', '😵‍💫', '🗡️'] as NegativeEffectEmoji[]
    }
    return []
  }

  async function enableEffect(value: NegativeEffectEmoji) {
    switch (value) {
      case '🔥':
        await enableFire()
        break
      default:
        return alert('Not implemented yet')
    }
  }

  async function enableFire() {
    fireQueue = [[selectedCell[0], selectedCell[1]]]
    const visited = new Set<string>([])
    while (fireQueue.length > 0) {
      shuffle(fireQueue)
      const el = fireQueue.shift()
      if (!el) return
      const [r, c] = el
      if (r < 0 || r > 8 || c < 0 || c > 8) continue
      if (visited.has(`${r}${c}`)) continue
      await new Promise(resolve => setTimeout(() => {
        resolve(placeEffect(NegativeEffectEmoji.Fire, r, c))
      }, 1000))

      visited.add(`${r}${c}`)
      fireQueue.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1])
    }
  }

  function enableExtinguisher(emoji: NegativeEffectEmoji, r: number, c: number) {
    placeEffect(emoji, r, c)
    if (r < 8) placeEffect(emoji, r + 1, c)
    if (r > 0) placeEffect(emoji, r - 1, c)
    if (c < 8) placeEffect(emoji, r, c + 1)
    if (c > 0) placeEffect(emoji, r, c - 1)

    if (r < 8 && c < 8) placeEffect(emoji, r + 1, c + 1)
    if (r < 8 && c > 0) placeEffect(emoji, r + 1, c - 1)
    if (r > 0 && c < 8) placeEffect(emoji, r - 1, c + 1)
    if (r > 0 && c > 0) placeEffect(emoji, r - 1, c - 1)

    fireQueue.splice(fireQueue.indexOf([r, c]), 1)
  }

  function endExtinguisher(r: number, c: number) {
    placeEffect('' as NegativeEffectEmoji, r, c)
    if (r < 8) placeEffect('' as NegativeEffectEmoji, r + 1, c)
    if (r > 0) placeEffect('' as NegativeEffectEmoji, r - 1, c)
    if (c < 8) placeEffect('' as NegativeEffectEmoji, r, c + 1)
    if (c > 0) placeEffect('' as NegativeEffectEmoji, r, c - 1)

    if (r < 8 && c < 8) placeEffect('' as NegativeEffectEmoji, r + 1, c + 1)
    if (r < 8 && c > 0) placeEffect('' as NegativeEffectEmoji, r + 1, c - 1)
    if (r > 0 && c < 8) placeEffect('' as NegativeEffectEmoji, r - 1, c + 1)
    if (r > 0 && c > 0) placeEffect('' as NegativeEffectEmoji, r - 1, c - 1)
  }

  function shuffle(array: unknown[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}
}
