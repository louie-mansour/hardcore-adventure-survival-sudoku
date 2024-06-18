interface Props {
  isFoundMistakes: boolean,
  isFoundHint: boolean,
  useItem: (value: string) => void,
  isOngoingHintsModeEnabled: boolean,
  isHardcoreModeEnabled: boolean,
  items: string[],
} 

export default function HintPanel({
  isFoundMistakes,
  isFoundHint,
  useItem,
  isOngoingHintsModeEnabled,
  isHardcoreModeEnabled,
  items,
}: Props) {

  function helperText(isOngoingHintsModeEnabled: boolean, isFoundMistakes: boolean, isFoundHint: boolean) {
    if (isOngoingHintsModeEnabled) {
      return (
        <p className='m-0 text-center'>Wittle baby wants a bottle? 🍼</p>
      )
    }

    if (isHardcoreModeEnabled) {
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
      <div className="flex flex-row justify-evenly">   
      { items.map(el =>
        <div
          className="cursor-pointer"
          key={el}
          onClick={ () => useItem(el) }
        >
          <div>
            <p className="text-5xl text-center">
              {el}
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