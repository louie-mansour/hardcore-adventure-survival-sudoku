interface Props {
  isFoundMistakes: boolean,
  isFoundHint: boolean,
  useItem: (value: string) => void,
  isOngoingHintsModeEnabled: boolean,
  isHardcoreModeEnabled: boolean,
  items: string[],
  enabledItem: string | undefined,
  chooseEnabledItem: (item: string) => void,
} 

export default function HintPanel({
  isFoundMistakes,
  isFoundHint,
  useItem,
  isOngoingHintsModeEnabled,
  isHardcoreModeEnabled,
  items,
  enabledItem,
  chooseEnabledItem,
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
      { items.map(el => {
        let className: string
        if (el === enabledItem) {
          className = "cursor-pointer border border-blue-500 border-2"
        } else {
          className="cursor-pointer"
        }
        return <div
          className={`${className}`}
          key={el}
          onClick={ () => {
            if (el === '✏️') {
              chooseEnabledItem('✏️')
              return
            }
            useItem(el)
          } }
        >
          <div>
            <p className="text-5xl text-center">
              {el}
            </p>
          </div>
        </div>
      }
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