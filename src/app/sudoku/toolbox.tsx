import { NegativeEffect, NegativeEffectEmoji, NegativeEffectName } from "@/models/effect"
import { Item, ItemName } from "@/models/item"
import { CellValue } from "@/models/sudoku"

interface ToolboxProps {
  putValueInCell: (value: CellValue) => void
  items: Item[]
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
      <div className='flex flex-col self-start'>
        <p className="text-xl self-start">
          Items:
        </p>
        <div className='grid grid-cols-5 gap-4'>
        { items.map((el, i) => {
          const invisible = el.name === ItemName.Placeholder ? 'invisible' : ''
          return (
            <div key={el.emoji + i} className={`flex flex-row justify-center items-center ${invisible}`}>
              <p
                className={`text-4xl cursor-pointer`}
                onClick={() => utilizeItem(el)}
              >
                {el.emoji}
              </p>
              <p className="text-lg">
                ×{el.numberOfUses === 'Infinite' ? '∞' : el.numberOfUses}
              </p>
            </div>
          )
        })}
        </div>
      </div>
        <p className="text-xl self-start">
            Negative Effects:
        </p>
        <div className="flex flex-row self-start">   
        { effects.map((el, i) => {
          const invisible = el.name === NegativeEffectName.PlaceHolder ? 'invisible' : ''
          return <div
            className='cursor-pointer'
            key={el.emoji + i}
            onClick={ () => {
              enableEffect(el)
            } }
          >
            <div>
              <p className={`text-4xl text-center ${invisible}`}>
                {el.emoji}
              </p>
            </div>
          </div>
        })}
        </div>
    </>
  )
}