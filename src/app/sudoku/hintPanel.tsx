interface Props {
  revealMistakes: () => void,
  isFoundMistakes: boolean,
  revealHint: () => void,
  isFoundHint: boolean,
  useTool: (value: string) => void
} 

export default function HintPanel({
  revealMistakes,
  isFoundMistakes,
  revealHint,
  isFoundHint,
  useTool,
}: Props) {

  return (
    <div className='h-32'>
      <div className="flex flex-row justify-evenly">   
      { [{
          emoji: '🗑️',
          text: 'Erase',
        },{
          emoji: '🧩',
          text: 'Clue',
        },{
          emoji: '🔍',
          text: 'Check',
        },{
          emoji: '🏳️',
          text: 'Solve',
        }].map(el => // Eventually we want to support drafts (pencil emoji)
        <div
          className="cursor-pointer"
          key={el.emoji}
          onClick={ () => useTool(el.emoji) }
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
    </div>
  )
}