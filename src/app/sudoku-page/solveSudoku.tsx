import { GameOption } from "../page"

interface Props {
  solveSudoku: () => void,
} 

export default function SolveButton({
  solveSudoku,
}: Props) {

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'left',
    }}>
      <button style={{ width: '100px'}} type='button' onClick={() => solveSudoku()} key={GameOption.HardcoreMode} >Solve</button>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'left',
      }}>
        <p style={{ margin: 0 }} >Provides the solution to the sudoku.</p>
      </div>
    </div>
  )
}