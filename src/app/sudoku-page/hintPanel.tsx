import { Button } from "@mui/material";

interface Props {
  checkForMistakes: () => void,
  revealMistakes: () => void,
  isFoundMistakes: boolean,
  getHint: () => void,
  revealHint: () => void,
  isFoundHint: boolean,
  solveSudoku: () => void,
} 

export default function HintPanel({
  checkForMistakes,
  revealMistakes,
  isFoundMistakes,
  getHint,
  revealHint,
  isFoundHint,
  solveSudoku,
}: Props) {

  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      }}>
        <Button style={{ width: '150px'}} type='button' onClick={() => checkForMistakes()} >Check Inputs</Button>
        <Button style={{ width: '150px'}} type='button' onClick={() => getHint()} >Get Hint</Button>
        <Button style={{ width: '150px'}} type='button' onClick={() => solveSudoku()} >Solve</Button>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        {
          isFoundMistakes &&
            <p style={{ margin: 0, textAlign: 'center' }} >We found a mistake. Click <a
              style={{
                color: 'red',
              }}
              onClick={() => revealMistakes()}>
                here
            </a> to reveal the square(s).</p>
        }
        {
          isFoundHint &&
            <p style={{ margin: 0, textAlign: 'center' }} >Here's a hint. Click <a
            style={{
              color: 'green'
            }}
            onClick={() => revealHint()}>
              here
            </a> to reveal its value.</p>
        }
        </div>
      </div>
    </>
  )
}