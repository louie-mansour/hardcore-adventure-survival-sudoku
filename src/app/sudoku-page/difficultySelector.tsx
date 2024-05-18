import { GameDifficulty } from "../page"

interface Props {
  requestNewGame: (_: GameDifficulty) => void
} 

export default function DifficultySelector({
  requestNewGame,
}: Props) {

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'left',
      gap: '20px',
    }}>
      <p>Difficulty:</p>
      {
        Object.values(GameDifficulty).map((difficultyValue: GameDifficulty) => {
          return (
            <p key={difficultyValue} onClick={() => requestNewGame(difficultyValue) } ><a>{displayDifficulty(difficultyValue)}</a></p>
          )
        })
      }
    </div>
  )

  function displayDifficulty(difficulty: GameDifficulty) {
    switch(difficulty) {
      case GameDifficulty.Easy: return 'Easy'
      case GameDifficulty.Medium: return 'Medium'
      case GameDifficulty.Hard: return 'Hard'
    }
  }
}