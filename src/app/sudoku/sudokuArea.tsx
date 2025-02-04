'use client'

import { SudokuConfig } from "@/config";
import { MistakeError } from "@/models/errors/mistake";
import { NegativeEffect, NegativeEffectEmoji, NegativeEffectName } from "@/models/effect";
import { Item, ItemEmoji, ItemName } from "@/models/item";
import { CellType, CellValue, Sudoku } from "@/models/sudoku";
import { useEffect, useState } from "react";
import Sudoku9x9Grid from "./sudokuGrid";
import Toolbox from "../sudoku/toolbox";

interface SudokuAreaProps {
  initialSudoku: Sudoku
  itemLocations: [Item, number, number, boolean][],
  removeItemLocation: (r: number, c: number) => boolean
  solveSudoku: () => void
  gameStart: () => void
  gameOver: () => void
  gameComplete: () => void
  gameTimer: number
  config: SudokuConfig
  negativeEffectTimers: Map<number, NegativeEffect[]>
  placedEffectLocations: Map<string, NegativeEffectEmoji>
  setPlacedEffectLocations: (value: any) => Map<string, NegativeEffectEmoji>
  numberOfLives: number
  setNumberOfLives: (value: any) => number
}

export default function SudokuArea(props: SudokuAreaProps) {
  const { initialSudoku, itemLocations, removeItemLocation, gameStart, gameOver, gameComplete, gameTimer, config, negativeEffectTimers, placedEffectLocations, setPlacedEffectLocations, numberOfLives, setNumberOfLives } = props

  const [sudoku, setSudoku] = useState<Sudoku>(() => initialSudoku)
  const [selectedCell, setSelectedCell] = useState<[number, number]>([0, 0])
  const [notes, setNotes] = useState(() => initNotes())
  const [inputs, setInputs] = useState<Map<number, [number, number, CellValue]>>(new Map())
  const [mistakes, setMistakes] = useState<Map<number, [number, number, CellValue]>>(() => new Map())
  const [hint, setHint] = useState<[number, number, CellValue] | null>(null)
  const [items, setItems] = useState(initItems())
  const [placedItemLocations, setPlacedItemLocations] = useState<[ItemEmoji, number, number][]>([])
  const [effects, setEffects] = useState<Set<NegativeEffect>>(initEffects())
  const [isNote, setIsNote] = useState<boolean>(false)
  const [numberOfShields, setNumberOfShields] = useState(0)
  const [plantLocations, setPlantLocations] = useState<Set<string>>(new Set())
  const [fireTimeouts, setFireTimeouts] = useState<Map<string, NodeJS.Timeout>>(new Map())
  const [isVolcanoErupting, setIsVolcanoErupting] = useState(false)
  const [volcanoTimeout, setVolcanoTimeout] = useState<NodeJS.Timeout>()

  // TODO: There is likely a way to do this without using useEffect
  useEffect(() => {
    if(sudoku.isSolved()) {
      gameComplete()
      return
    }
    gameStart()
  }, [sudoku])

  useEffect(() => {
    gameStart() 
  }, [])

  useEffect(() => {
    const negativeEffectTimerLookup = negativeEffectTimers.get(gameTimer)
    if (negativeEffectTimerLookup) {
      negativeEffectTimerLookup.forEach(effect => enableEffect(effect))
    }
  }, [gameTimer])

  useEffect(() => {
    reset()

    function reset() {
      setSudoku(initialSudoku)
      setNotes(initNotes())
      setMistakes(new Map())
      setHint(null)
      setItems(initItems())
    }
  }, [initialSudoku])

  useEffect(() => {
    setItems(initItems())
  }, [])

  return (
    <div className='flex flex-col justify-center items-center gap-3'>
      <Sudoku9x9Grid
        selectedCell={selectedCell}
        selectCell={selectCell}
        sudoku={sudoku}
        hint={hint}
        inputs={inputs}
        mistakes={mistakes}
        emojiLocations={itemLocations}
        gameover={gameOver}
        notes={notes}
        putValueInCell={putValueInCell}
        numberOfShields={numberOfShields}
        placedItemLocations={placedItemLocations}
        placedEffectLocations={new Map([ ...placedEffectLocations])}
        gameTimer={gameTimer}
        config={config}
        numberOfLives={numberOfLives}
        setNumberOfLives={setNumberOfLives}
        isVolcanoErupting={isVolcanoErupting}
      />
      <Toolbox
        putValueInCell={putValueInCell}
        items={items}
        utilizeItem={utilizeItem}
        setIsNote={setIsNote}
        isNote={isNote}
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
    setPlacedEffectLocations((e: Map<string, NegativeEffectEmoji>) => {
      return new Map<string, NegativeEffectEmoji>(e.set(JSON.stringify([row, col]), emoji)) // TODO: It appears we need a new map for this to render. I suspect it's related to the reference
    })
  }

  function deleteEffect(row: number, col: number) {
    setPlacedEffectLocations((e: Map<string, NegativeEffectEmoji>) => {
      e.delete(JSON.stringify([row, col]))
      return new Map(e)
    })
  }

  function updateSudoku(value: CellValue, row: number, col: number) {
    let didUpdate = false
    const now = Date.now()
    setSudoku(s => {
      try {
        const updatedSudoku = s.updateCell(value, row, col)
        didUpdate = true
        if (hint && hint[0] === row && hint[1] === col) {
          setHint(null)
        }
        setInputs(i => i.set(now, [row, col, value]))
        return updatedSudoku
      } catch (error: unknown) {
        if (error instanceof MistakeError) {
          setMistakes(m => new Map([...m.set(now, [row, col, value])]))
        }
        return s
      }
    })

    if (!didUpdate) {
      return
    }

    const itemLocation = itemLocations.find(el => el[1] === row && el[2] === col && el[3])
    if (value && itemLocation) {
      removeItemLocation(itemLocation[1], itemLocation[2])
      setItems(i => {
        const idx = i.findIndex(e => e.name === itemLocation[0].name)
        if (idx === -1) {
          return [...new Set([...i, itemLocation[0]])]
        }
        i[idx].addUses(itemLocation[0].numberOfUses)
        return [ ...i ]
      })
    }
  }

  function selectCell(cell: [number, number]) {
    setSelectedCell(cell)
  }

  function putValueInCell(value: CellValue) {
    if (isNote) {
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

  function utilizeItem(item: Item) {
    const row = selectedCell[0]
    const col = selectedCell[1]
    const currentCell = sudoku.getCells()[row][col]
    switch (item.name) {
      case ItemName.CrystalBall:
        if (!hint && item.use()) {
          return setHint(sudoku.getHint())
        }
        return
      case ItemName.MagicWand:
        if (!currentCell.value && currentCell.cellType === CellType.Variable && item.use()) {
          return updateSudoku(sudoku.solved[row][col].value, row, col)
        }
        return
      case ItemName.Shield:
        if (!item.use()) {
          return
        }
        return increaseNumberOfShields()
      case ItemName.Plant:
        if (!currentCell.value && currentCell.cellType === CellType.Variable && !plantLocations.has(JSON.stringify([row, col])) && item.use()) {
          plantLocations.add(JSON.stringify([row, col]))
          placeItem(ItemEmoji.Plant, row, col)
          setTimeout(() => { // TODO: Promises with await/then would be nicer
            placeItem(ItemEmoji.PlantMedium, row, col)
            setTimeout(() => {
              placeItem(ItemEmoji.PlantLarge, row, col)
              setTimeout(() => {
                updateSudoku(sudoku.solved[row][col].value, row, col)
                setPlantLocations(l => {
                  l.delete(JSON.stringify([row, col]))
                  return l
                })
              }, config.plantGrowingMilliseconds)
            }, config.plantGrowingMilliseconds)
          }, config.plantGrowingMilliseconds)
          return
        }
        return
      case ItemName.FireExtinguisher:
        if (!item.use()) {
          return
        }

        enableExtinguisher(NegativeEffectEmoji.ExtinguishingSpraySmall, row, col)
        setTimeout(() => { // TODO: Promises with await/then would be nicer
          enableExtinguisher(NegativeEffectEmoji.ExtinguishingSprayMedium, row, col)
          setTimeout(() => {
            enableExtinguisher(NegativeEffectEmoji.ExtinguishingSprayLarge, row, col)
            setTimeout(() => {
              enableExtinguisher(NegativeEffectEmoji.ExtinguishingSpray, row, col)
              setTimeout(() => endExtinguisher(row, col), config.extinguisherSprayMilliseconds)
            }, config.extinguisherSprayMilliseconds)
          }, config.extinguisherSprayMilliseconds)
        }, config.extinguisherSprayMilliseconds)
        return
      default:
        return alert('Not implemented yet')
    }
  }

  function initItems(): Item[] {
    if (config.mode === 'DEVELOPER') {
      return [
        // Appear in item bar in game
        Item.factory(ItemName.FireExtinguisher),
        Item.factory(ItemName.MagicWand),
        Item.factory(ItemName.CrystalBall),
        // Item.factory(ItemName.GameDie),
        Item.factory(ItemName.Plant),

        // Don't appear in item bar
        Item.factory(ItemName.Shield),
      ]
    }
    return [
      Item.factory(ItemName.FireExtinguisher),
      // Item.factory(ItemName.MagicWand),
      // Item.factory(ItemName.CrystalBall),
      // Item.factory(ItemName.GameDie),
      // Item.factory(ItemName.Plant),
    ]
  }

  function increaseNumberOfShields() {
    setNumberOfShields(s => {
      return s + 1
    })
  }

  function initEffects(): Set<NegativeEffect> {
    if (config.mode === 'DEVELOPER') {
      return new Set([
        NegativeEffect.factory(NegativeEffectName.Fire),
        NegativeEffect.factory(NegativeEffectName.Turtle),
        NegativeEffect.factory(NegativeEffectName.Volcano),
        NegativeEffect.factory(NegativeEffectName.Darkness),
        NegativeEffect.factory(NegativeEffectName.Mirror),
        NegativeEffect.factory(NegativeEffectName.Rat),
        NegativeEffect.factory(NegativeEffectName.Dizzy),
        NegativeEffect.factory(NegativeEffectName.Dagger),
      ])
    }
    return new Set([
      NegativeEffect.factory(NegativeEffectName.PlaceHolder),
    ])
  }

  async function enableEffect(value: NegativeEffect) {
    const r = Math.floor(Math.random() * 8)
    const c = Math.floor(Math.random() * 8)
    switch (value.name) {
      case NegativeEffectName.Fire:
        return await enableFire(r, c);
      case NegativeEffectName.Volcano:
        return await enableVolcano();
      default:
        return alert('Not implemented yet')
    }
  }

  async function enableVolcano() {
    const volcanoEffect =  NegativeEffect.factory(NegativeEffectName.Volcano)
    clearTimeout(volcanoTimeout)
    setIsVolcanoErupting(true)
    setEffects(e => e.add(volcanoEffect))
    const newVolcanoTimeout = setTimeout(() => {
      setEffects(e => {
        e.delete(volcanoEffect)
        return e
      })
      setIsVolcanoErupting(false)
    }, config.volcanoTimeoutSeconds * 1000)
    setVolcanoTimeout(newVolcanoTimeout)
  }

  async function enableFire(r: number, c: number) {
    const fireEffect = NegativeEffect.factory(NegativeEffectName.Fire)
    const fireStartString = JSON.stringify([r, c])
    setPlacedEffectLocations((e: Map<string, NegativeEffectEmoji>) => new Map(e.set(fireStartString, NegativeEffectEmoji.Fire)))
    setFireTimeouts(f => {
      if (f.get(fireStartString)) return f
      const newTimeout = setTimeout(() => {
        setSudoku(s => {
          const newSudoku = s.deleteCell(JSON.parse(fireStartString)[0], JSON.parse(fireStartString)[1])
          setHint(h => {
            if (h) {
              return newSudoku.getHint();
            }
            return null;
          })
          return newSudoku
        })
        
      }, config.fireBurnsNumberMilliseconds)
      return new Map(f.set(fireStartString, newTimeout))
    })
    let isFire = true
    while (isFire) {
      setEffects(e => e.add(fireEffect))
      await new Promise(resolve => setTimeout(resolve, config.fireSpreadsMilliseconds))
      setPlacedEffectLocations((e: Map<string, NegativeEffectEmoji>) => {
        let fireLocations = []
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            if (e.has(JSON.stringify([r, c]))) {
              fireLocations.push([r, c])
            }
          }
        }
        if (fireLocations.length === 0) {
          isFire = false
          return new Map(e)
        }
        const fireOptions: Set<string> = new Set()
        fireLocations.forEach(([r, c]) => {
          if (r < 8 && !fireLocations.find(el => el[0] === r + 1 && el[1] === c)) fireOptions.add(JSON.stringify([r + 1, c]))
          if (r > 0 && !fireLocations.find(el => el[0] === r - 1 && el[1] === c)) fireOptions.add(JSON.stringify([r - 1, c]))
          if (c < 8 && !fireLocations.find(el => el[0] === r && el[1] === c + 1)) fireOptions.add(JSON.stringify([r, c + 1]))
          if (c > 0 && !fireLocations.find(el => el[0] === r && el[1] === c - 1)) fireOptions.add(JSON.stringify([r, c - 1]))
        })

        const fireOptionsList = [ ...fireOptions ]
        shuffle(fireOptionsList)
        const newFireLocation = fireOptionsList.shift()
        if (!newFireLocation) return new Map(e)
        setFireTimeouts(f => {
          if (f.get(newFireLocation)) return f
          
          const newTimeout = setTimeout(() => {
            setSudoku(s => {
              const newSudoku = s.deleteCell(JSON.parse(newFireLocation)[0], JSON.parse(newFireLocation)[1])
              setHint(h => {
                if (h) {
                  return newSudoku.getHint();
                }
                return null;
              })
              return newSudoku
            })
          }, config.fireBurnsNumberMilliseconds)
          return new Map(f.set(newFireLocation, newTimeout))
        })
        return new Map(e.set(newFireLocation, NegativeEffectEmoji.Fire))
      })

    }
    setEffects(e => {
      e.delete(fireEffect)
      return e
    })
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

    setFireTimeouts(f => {
      for (let i = r - 1; i <= r + 1; i++) {
        for (let j = c - 1; j <= c + 1; j++) {
          const fireTimeout = f.get(JSON.stringify([i, j]))
          if (fireTimeout) {
            clearTimeout(fireTimeout)
            f.delete(JSON.stringify([i, j]))
          }
        }
      }
      return f
    })
  }

  function endExtinguisher(r: number, c: number) {
    deleteEffect(r, c)
    if (r < 8) deleteEffect(r + 1, c)
    if (r > 0) deleteEffect(r - 1, c)
    if (c < 8) deleteEffect(r, c + 1)
    if (c > 0) deleteEffect(r, c - 1)

    if (r < 8 && c < 8) deleteEffect(r + 1, c + 1)
    if (r < 8 && c > 0) deleteEffect(r + 1, c - 1)
    if (r > 0 && c < 8) deleteEffect(r - 1, c + 1)
    if (r > 0 && c > 0) deleteEffect(r - 1, c - 1)
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
