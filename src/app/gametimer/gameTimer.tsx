interface GameTimerProps {
  gameTimer: number
}

export default function GameTimer(props: GameTimerProps) {
  const { gameTimer } = props
  const hours = Math.floor(gameTimer / 3600)
  const minutes = Math.floor((gameTimer % 3600) / 60)
  const seconds = gameTimer % 60

  const withHours = (
    <span className="font-mono">
      {`${hours.toString()}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
    </span>
  )

  if (hours) {
    return withHours
  }
  return (
    <span className="font-mono">
      {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
    </span>
  )
}

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')