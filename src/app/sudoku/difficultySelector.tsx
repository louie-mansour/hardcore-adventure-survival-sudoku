import { GameDifficulty } from "@/models/game"

interface Props {
  requestNewGame: (_: GameDifficulty) => void
  difficulty: GameDifficulty
} 

export default function DifficultySelector({
  requestNewGame,
  difficulty,
}: Props) {


  return (
    <div className="flex flex-row justify-start gap-x-20">
      <p>Difficulty:</p>
      {
        Object.values(GameDifficulty).map((difficultyValue: GameDifficulty) => {
          return (
            <p
              key={difficultyValue}
              onClick={() => requestNewGame(difficultyValue) }
            >
              <a
                className={`font-medium cursor-pointer ${difficultyValue === difficulty ? 'text-black' : 'text-gray-500'}`}
              >{displayDifficulty(difficultyValue)}</a>
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