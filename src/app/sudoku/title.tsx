interface TitleProps {
  isHardcoreModeEnabled: boolean
  isOngoingHintsModeEnabled: boolean
}

export default function Title(props: TitleProps) {
  return (
    <h1 className='title text-lg'>{getTitle(props)}</h1>
  )
}

function getTitle(props: TitleProps): string {
  const { isHardcoreModeEnabled, isOngoingHintsModeEnabled } = props
  if (isHardcoreModeEnabled) {
    return 'Hardcore Survival Adventure Sudoku 💪'
  }
  if (isOngoingHintsModeEnabled) {
    return '🍼 Weally 🍼 Wittle 🍼 Baby 🍼 Mode 🍼'
  }
  return 'Wittle Baby Mode 🍼'
}
