import { GameOption } from "../page"

interface Props {
  getHint: () => void,
  revealHint: () => void,
  isFoundHint: boolean,
} 

export default function HintButton({
  getHint,
  revealHint,
  isFoundHint,
}: Props) {

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'left',
    }}>
      <button style={{ width: '100px'}} type='button' onClick={() => getHint()} key={GameOption.HardcoreMode} >Get Hint</button>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'left',
      }}>
        {
          (isFoundHint)
            ?
              <>
                <p style={{ margin: 0 }} >Here is a hint.</p>
                <p style={{ margin: 0 }} >Click <a onClick={() => revealHint()}>here</a> to reveal the value.</p>
              </>
            :
              <>
                <p style={{ margin: 0 }} >Highlights where your next move is.</p>
                <p style={{ margin: 0 }} >We can also tell you what it is if you want.</p>
              </>

        }
      </div>
    </div>
  )
}