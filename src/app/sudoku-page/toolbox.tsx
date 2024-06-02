import { CellValue } from "@/models/sudoku"

interface ToolboxProps {
  putValueInCell: (value: CellValue) => void
}

export default function Toolbox(props: ToolboxProps) {
  const { putValueInCell } = props
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    }}>
      { ['1','2','3','4','5','6','7','8','9'].map(el =>
        <div
          onClick={ () => putValueInCell(el as CellValue) }
        >
          <p style={{
            fontSize: '40px',
          }}>
            {el}
          </p>
        </div>
      )
      }
    </div>
  )
}