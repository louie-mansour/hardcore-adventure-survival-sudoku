import { GameDifficulty } from "../page"

interface Props {
  requestNewGame: (_: GameDifficulty) => void
  difficulty: GameDifficulty
} 

export default function DifficultySelector({
  requestNewGame,
  difficulty,
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
            <p
              key={difficultyValue}
              onClick={() => requestNewGame(difficultyValue) }
              style={{
                color: difficultyValue === difficulty ? 'black' : 'darkgray',
                fontWeight: 700,
              }}
            >
              <a>{displayDifficulty(difficultyValue)}</a>
            </p>
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