export interface SudokuConfig {
  mode: 'NORMAL' | 'DEVELOPER',
  startingNumberOfLives: number,
  preselectedSudoku: number | null,
  itemDisplayTimeoutMilliseconds: number,
  mistakeTimeoutMilliseconds: number,
}

export const config: SudokuConfig = {
  mode: process.env.NEXT_PUBLIC_MODE === 'DEVELOPER' ? 'DEVELOPER' : 'NORMAL',

  startingNumberOfLives: Number(process.env.STARTING_NUMBER_OF_LIVES) || 3,
  preselectedSudoku: Number(process.env.PRESELECTED_SUDOKU) || null,

  itemDisplayTimeoutMilliseconds: Number(process.env.ITEM_DISPLAY_TIMEOUT_MILLISECONDS) || 3000,
  mistakeTimeoutMilliseconds: Number(process.env.MISTAKE_TIMEOUT_MILLISECONDS) || 3000,
}