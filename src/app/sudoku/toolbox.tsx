import { CellValue } from "@/models/sudoku"

interface ToolboxProps {
  putValueInCell: (value: CellValue) => void
}

export default function Toolbox(props: ToolboxProps) {
  const { putValueInCell } = props
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
      <div className="flex flex-row justify-evenly">
        
      { ['🗑️'].map(el => // Eventually we want to support drafts (pencil emoji)
        <div
          className="cursor-pointer"
          key={el}
          onClick={ () => putValueInCell(null) }
        >
          <p className="text-5xl">
            {el}
          </p>
        </div>
      )}
    </div>
  </>
  )
}