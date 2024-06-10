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
      <div className='flex flex-row place-content-evenly'>
        <Button className='w-40' type='button' onClick={() => checkForMistakes()} >Check Inputs</Button>
        <Button className='w-40' type='button' onClick={() => getHint()} >Get Hint</Button>
        <Button className='w-40' type='button' onClick={() => solveSudoku()} >Solve</Button>
      </div>
      <div className='flex flex-row justify-center'>
        <div className='flex flex-col justify-center'>
        {
          isFoundMistakes &&
            <p className='m-0 text-center'>We found a mistake. Click <a
              className='text-red-500' onClick={() => revealMistakes()}>here</a> to reveal the square(s).
            </p>
        }
        {
          isFoundHint &&
            <p className='m-0 text-center'>Here&lsquo;s a hint. Click <a
              className='text-green-500' onClick={() => revealHint()}>here</a> to reveal its value.
            </p>
        }
        </div>
      </div>
    </>
  )
}