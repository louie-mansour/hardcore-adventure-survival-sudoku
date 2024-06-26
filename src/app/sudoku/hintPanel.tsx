import { GameMode } from "../playarea/playArea"

interface Props {
  isFoundMistakes: boolean,
  isFoundHint: boolean,
  gameMode: GameMode,
}

export default function HintPanel({
  isFoundMistakes,
  isFoundHint,
  gameMode,
}: Props) {

  function helperText(gameMode: GameMode, isFoundMistakes: boolean, isFoundHint: boolean) {
    if (gameMode === GameMode.OngoingHints) {
      return (
        <p className='m-0 text-center'>Wittle baby wants a bottle? 🍼</p>
      )
    }

    if (gameMode === GameMode.Hardcore) {
      return
    }

    if (isFoundMistakes) {
      return <p className='m-0 text-center'>We found a mistake. Click 🔍 again to reveal the square(s)</p>
    }
    if (isFoundHint) {
      return <p className='m-0 text-center'>Here&lsquo;s a hint. Click 🔍 again to reveal its value</p>
    }
  }

  return (
    <div className='h-32'>
      <div className='flex flex-row justify-center'>
        <div className='flex flex-col justify-center'>
        { helperText(gameMode, isFoundMistakes, isFoundHint) }
        </div>
      </div>
    </div>
  )
}