import { NegativeEffectEmoji } from "@/models/effect"
import { Item } from "@/models/item"
import { CellValue } from "@/models/sudoku"

interface ToolboxProps {
  putValueInCell: (value: CellValue) => void
  items: Item[]
  enabledItem: Item | undefined,
  utilizeItem: (value: Item) => void,
  effects: NegativeEffectEmoji[],
  enableEffect: (value: NegativeEffectEmoji) => void,
}

export default function Toolbox(props: ToolboxProps) {
  const { putValueInCell, items, enabledItem, utilizeItem, effects, enableEffect } = props
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
      <p className="text-3xl self-start">
        Items:
      </p>
      <div className='flex flex-col self-start'>
      { items.map(el => {
        let className: string
        if (el === enabledItem) {
          className = "cursor-pointer border border-blue-500 border-2"
        } else {
          className="cursor-pointer"
        }
        return el.numberOfUses > 0 || el.numberOfUses === 'Infinite' ? <div className='flex flex-row items-center'>
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
      <div className='h-32'>
        <div className="flex flex-row justify-evenly">   
          <p className="text-3xl">
            Negative Effects:
          </p>
        { effects.map(el => {
          return <div
            className='cursor-pointer'
            key={el}
            onClick={ () => {
              enableEffect(el)
            } }
          >
            <div>
              <p className="text-5xl text-center">
                {el}
              </p>
            </div>
          </div>
        })}
        </div>
      </div>
    </>
  )
}