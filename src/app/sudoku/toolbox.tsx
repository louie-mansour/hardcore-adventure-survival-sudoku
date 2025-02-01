import { NegativeEffect, NegativeEffectName } from "@/models/effect"
import { Item, ItemName } from "@/models/item"
import { CellValue } from "@/models/sudoku"
import { draftText, itemsText, negativeEffectsText, writeText } from "@/text"

interface ToolboxProps {
  putValueInCell: (value: CellValue) => void
  items: Item[]
  setIsNote: (value: boolean) => void,
  isNote: boolean,
  utilizeItem: (value: Item) => void,
  effects: Set<NegativeEffect>,
  enableEffect: (value: NegativeEffect) => void,
}

export default function Toolbox(props: ToolboxProps) {
  const { putValueInCell, items, utilizeItem, isNote, setIsNote, effects, enableEffect } = props
  const writeBackgroundColor = isNote ? 'bg-draft-unselected-light' : 'bg-draft-selected-light'
  const draftBackgroundColor = isNote ? 'bg-draft-selected-light' : 'bg-draft-unselected-light'
  return (
    <>
      <div className="flex flex-row justify-evenly gap-3">
        { ['1','2','3','4','5','6','7','8','9'].map(el =>
          <div
            className="cursor-pointer"
            key={el}
            onClick={() => {
              putValueInCell(el as CellValue)
            }}
          >
            <p className="text-5xl text-numbers-text-light">
              {el}
            </p>
          </div>
        )}
      </div>
      <div>
        <button className="text-draft-text-light inline-flex">
          <input checked={!isNote} onClick={() => setIsNote(false)} className="hidden" type="radio" id="write" />
          <label className={`${writeBackgroundColor} px-5 py-2.5 border border-draft-selected-light text-draft-text-light rounded-l-lg`} htmlFor="write">{writeText}</label>
        </button>
        <button className="text-draft-text-light inline-flex">
          <input checked={isNote} onClick={() => setIsNote(true)} className="hidden" type="radio" id="draft" />
          <label className={`${draftBackgroundColor} px-5 py-2.5 border border-draft-selected-light text-draft-text-light rounded-r-lg`} htmlFor="draft">{draftText}</label>
        </button>
      </div>
      <div className='flex flex-col self-start'>
        <p className="text-xl self-start text-toolbox-text-light">
          {itemsText}
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
              <p className="text-lg text-toolbox-text-light">
                ×{el.numberOfUses === 'Infinite' ? '∞' : el.numberOfUses}
              </p>
            </div>
          )
        })}
        </div>
      </div>
        <p className="text-xl self-start text-toolbox-text-light">
            {negativeEffectsText}
        </p>
        <div className="flex flex-row self-start">   
          { [...effects].map((el, i) => {
            const invisible = el.name === NegativeEffectName.PlaceHolder ? 'invisible' : ''
            return (
              <div key={el.emoji + i} className={`flex flex-row justify-center items-center ${invisible}`}>
                <p
                  className={`text-4xl text-center cursor-pointer`}
                  onClick={() => enableEffect(el)}
                >
                  {el.emoji}
                </p>
              </div>
            )
          })}
        </div>
    </>
  )
}