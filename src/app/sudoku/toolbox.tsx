import { EffectEmoji } from "@/models/effect"
import { CellValue } from "@/models/sudoku"

interface ToolboxProps {
  putValueInCell: (value: CellValue) => void
  items: string[]
  enabledItem: string | undefined,
  useItem: (value: string) => void,
  effects: EffectEmoji[],
  enableEffect: (value: EffectEmoji) => void,
}

export default function Toolbox(props: ToolboxProps) {
  const { putValueInCell, items, enabledItem, useItem, effects, enableEffect } = props
  return (
    <>
      <div className="flex flex-row justify-evenly">
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
      <div className='h-32'>
        <div className="flex flex-row justify-evenly">   
        { items.map(el => {
          let className: string
          if (el === enabledItem) {
            className = "cursor-pointer border border-blue-500 border-2"
          } else {
            className="cursor-pointer"
          }
          return <div
            className={`${className}`}
            key={el}
            onClick={ () => {
              useItem(el)
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
      <div className='h-32'>
        <div className="flex flex-row justify-evenly">   
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