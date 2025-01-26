export interface SudokuConfig {
  mode: 'NORMAL' | 'DEVELOPER',
  startingNumberOfLives: number,
  preselectedSudoku: number | null,
  itemDisplayTimeoutMilliseconds: number,
  mistakeTimeoutMilliseconds: number,
  maxSudokuTimeHours: number,
  meanSecondsBetweenFires: number,
}

export const config: SudokuConfig = {
  mode: process.env.NEXT_PUBLIC_MODE === 'DEVELOPER' ? 'DEVELOPER' : 'NORMAL',

  startingNumberOfLives: Number(process.env.STARTING_NUMBER_OF_LIVES) || 3,
  preselectedSudoku: Number(process.env.PRESELECTED_SUDOKU) || null,

  itemDisplayTimeoutMilliseconds: Number(process.env.ITEM_DISPLAY_TIMEOUT_MILLISECONDS) || 3000,
  mistakeTimeoutMilliseconds: Number(process.env.MISTAKE_TIMEOUT_MILLISECONDS) || 3000,

  maxSudokuTimeHours: Number(process.env.MAX_SUDOKU_TIME_HOURS) || 10,
  meanSecondsBetweenFires: Number(process.env.MEAN_SECONDS_BETWEEN_FIRES) || 20,
}