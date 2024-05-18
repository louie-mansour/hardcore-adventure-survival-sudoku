import { GameOption } from "../page"

interface Props {
  checkForMistakes: () => void,
  revealMistakes: () => void,
  isFoundErrors: boolean,
} 

export default function CheckButton({
  checkForMistakes,
  revealMistakes,
  isFoundErrors,
}: Props) {

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'left',
    }}>
      <button style={{ width: '100px'}} type='button' onClick={() => checkForMistakes()} >Check</button>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'left',
      }}>
        {
          (isFoundErrors)
            ?
              <p style={{ margin: 0 }} >We found a mistake. Click <a onClick={ () => revealMistakes() }>here</a> to reveal the square(s).</p>
            :
            <>
              <p style={{ margin: 0 }} >Verifies your sudoku inputs.</p>
              <p style={{ margin: 0 }} >We can check complete or incomplete sudokus.</p>
            </>
        }
      </div>
    </div>
  )
}