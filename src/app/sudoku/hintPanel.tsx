interface Props {
  isFoundMistakes: boolean,
  isFoundHint: boolean,
  useItem: (value: string) => void,
  isHardcoreModeEnabled: boolean,
  isOngoingHintsModeEnabled: boolean,
} 

export default function HintPanel({
  isFoundMistakes,
  isFoundHint,
  useItem,
  isHardcoreModeEnabled,
  isOngoingHintsModeEnabled,
}: Props) {

  function helperText(isOngoingHintsModeEnabled: boolean, isFoundMistakes: boolean, isFoundHint: boolean) {
    if (isOngoingHintsModeEnabled) {
      return (
        <p className='m-0 text-center'>Wittle baby wants a bottle? 🍼</p>
      )
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
      <div className="flex flex-row justify-evenly">   
      { getItems(isHardcoreModeEnabled, isOngoingHintsModeEnabled).map(el =>
        <div
          className="cursor-pointer"
          key={el.emoji}
          onClick={ () => useItem(el.emoji) }
        >
          <div>
            <p className="text-5xl text-center">
              {el.emoji}
            </p>
            <p className='text-s text-center p-2 font-semibold'>
              {el.text}
            </p>
          </div>
        </div>
      )}
      </div>
      <div className='flex flex-row justify-center'>
        <div className='flex flex-col justify-center'>
        { helperText(isOngoingHintsModeEnabled, isFoundMistakes, isFoundHint) }
        </div>
      </div>
    </div>
  )
}

interface Tool {
  emoji: string
  text: string
}

const coreTools = [{
  emoji: '✏️',
  text: '',
}]

const normalTools = [{
  emoji: '🔍',
  text: '',
}, {
  emoji: '🏳️',
  text: '',
}]

const onGoingHintsModeTools = [{
  emoji: '🗑️',
  text: '',
}, {
  emoji: '🍼',
  text: '',
}, {
  emoji: '🏳️',
  text: '',
}]

const hardcoreModeTools = [{
  emoji: '🧯',
  text: '',
}]

function getItems(isHardcoreModeEnabled: boolean, isOngoingHintsModeEnabled: boolean): Tool[] {
  if (isHardcoreModeEnabled) {
    return [...coreTools, ...hardcoreModeTools]
  }
  if (isOngoingHintsModeEnabled) {
    return [...coreTools, ...onGoingHintsModeTools]
  }
  return [...coreTools, ...normalTools]
}