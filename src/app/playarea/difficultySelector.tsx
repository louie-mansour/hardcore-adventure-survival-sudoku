import { GameDifficulty } from "@/models/game"
import { easyText } from "@/text"

interface Props {
  requestNewGame: (_: GameDifficulty) => void
  difficulty: GameDifficulty
} 

export default function DifficultySelector({
  requestNewGame,
  difficulty,
}: Props) {


  return (
    <div className="flex flex-row justify-center gap-x-9">
      {
        Object.values(GameDifficulty).map((difficultyValue: GameDifficulty) => {
          return (
            <p
              key={difficultyValue}
              onClick={() => requestNewGame(difficultyValue) }
            >
              <a
                className="font-medium cursor-pointer text-page-text-light"
              >{displayDifficulty(difficultyValue)}</a>
            </p>
          )
        })
      }
    </div>
  )

  function displayDifficulty(difficulty: GameDifficulty) {
    switch(difficulty) {
      case GameDifficulty.Easy: return easyText
      // case GameDifficulty.Medium: return 'Medium'
      // case GameDifficulty.Hard: return 'Hard'
    }
  }
}