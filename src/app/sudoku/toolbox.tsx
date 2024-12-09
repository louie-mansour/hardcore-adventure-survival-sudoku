import { NegativeEffect, NegativeEffectEmoji } from "@/models/effect"
import { Item } from "@/models/item"
import { CellValue } from "@/models/sudoku"

interface ToolboxProps {
  putValueInCell: (value: CellValue) => void
  items: Item[]
  // enabledItem: Item | undefined,
  setIsNote: (value: boolean) => void,
  isNote: boolean,
  utilizeItem: (value: Item) => void,
  effects: NegativeEffect[],
  enableEffect: (value: NegativeEffect) => void,
}

export default function Toolbox(props: ToolboxProps) {
  const { putValueInCell, items, utilizeItem, isNote, setIsNote, effects, enableEffect } = props
  return (
    <>
      <div className="flex flex-row justify-evenly gap-3">
        { ['1','2','3','4','5','6','7','8','9'].map(el =>
          <div
            className="cursor-pointer"
            key={el}
            onClick={ () => putValueInCell(el as CellValue) }
          >
            <p className="text-5xl">
              {el}
            </p>
          </div>
        )}
      </div>
      <div>
        <button className="text-black inline-flex">
          <input checked={!isNote} onClick={() => setIsNote(false)} className="hidden" type="radio" id="Login21" name="row1" />
          <label className="bg-white px-5 py-2.5 border border-blue-300 rounded-l-lg" htmlFor="Login21">Write ✒️</label>
        </button>
        <button className="text-black inline-flex">
          <input checked={isNote} onClick={() => setIsNote(true)} className="hidden" type="radio" id="Login22" name="row1" />
          <label className="bg-white px-5 py-2.5 px-5 py-2.5 border border-blue-300 rounded-r-lg" htmlFor="Login22">Draft ✏️</label>
        </button>
      </div>
      <p className="text-3xl self-start">
        Items
      </p>
      <div className='flex flex-col self-start'>
      { items.map(el => {
        let className: string
        // if (el === enabledItem) {
        //   className = "cursor-pointer border border-blue-500 border-2"
        // } else {
          className="cursor-pointer"
        // }
        return el.numberOfUses === 'Infinite' || el.numberOfUses > 0 ? <div className='flex flex-row items-center'>
          <p
            className={`text-5xl ${className}`}
            onClick={() => utilizeItem(el)}
          >
            {el.emoji}
          </p>
          <p className="text-xl">
            Qty: {el.numberOfUses}
          </p>
        </div> : null
      })}
      </div>
      {/* <div className='h-32'> */}
        <p className="text-3xl self-start">
            Negative Effects
        </p>
        <div className="flex flex-row self-start">   
        { effects.map(el => {
          return <div
            className='cursor-pointer'
            key={el.emoji}
            onClick={ () => {
              enableEffect(el)
            } }
          >
            <div>
              <p className="text-5xl text-center">
                {el.emoji}
              </p>
            </div>
          </div>
        })}
        </div>
      {/* </div> */}
    </>
  )
}