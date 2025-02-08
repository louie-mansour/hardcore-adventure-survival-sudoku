export interface SudokuConfig {
  mode: 'NORMAL' | 'DEVELOPER',
  startingNumberOfLives: number,
  preselectedSudoku: number | null,
  itemDisplayTimeoutMilliseconds: number,
  mistakeTimeoutMilliseconds: number,
  maxSudokuTimeHours: number,
  meanSecondsBetweenFires: number,
  fireSpreadsMilliseconds: number,
  extinguisherSprayMilliseconds: number,
  fireBurnsNumberMilliseconds: number,
  meanSecondsBetweenEruptions: number,
  volcanoTimeoutSeconds: number,
  meanSecondsBetweenDarknes: number,
  darknessTimeoutSeconds: number,
  plantGrowingMilliseconds: number,
}

export const config: SudokuConfig = {
  mode: process.env.NEXT_PUBLIC_MODE === 'DEVELOPER' ? 'DEVELOPER' : 'NORMAL',

  startingNumberOfLives: Number(process.env.STARTING_NUMBER_OF_LIVES) || 3,
  preselectedSudoku: Number(process.env.PRESELECTED_SUDOKU) || null,

  itemDisplayTimeoutMilliseconds: Number(process.env.ITEM_DISPLAY_TIMEOUT_MILLISECONDS) || 3000,
  mistakeTimeoutMilliseconds: Number(process.env.MISTAKE_TIMEOUT_MILLISECONDS) || 3000,

  maxSudokuTimeHours: Number(process.env.MAX_SUDOKU_TIME_HOURS) || 24,

  meanSecondsBetweenFires: Number(process.env.MEAN_SECONDS_BETWEEN_FIRES) || 40,
  fireSpreadsMilliseconds: Number(process.env.FIRE_SPREADS_MILLISECONDS) || 3000,
  fireBurnsNumberMilliseconds: Number(process.env.FIRE_BURNS_NUMBER_MILLISECONDS) || 6000,
  extinguisherSprayMilliseconds: Number(process.env.EXTINGUISHER_SPRAY_MILLISECONDS) || 50,

  meanSecondsBetweenEruptions: Number(process.env.MEAN_SECONDS_BETWEEEN_ERUPTIONS) || 80,
  volcanoTimeoutSeconds: Number(process.env.VOLCANO_TIMEOUT_SECONDS) || 5,

  meanSecondsBetweenDarknes: Number(process.env.MEAN_SECONDS_BETWEEEN_DARKNESS) || 120,
  darknessTimeoutSeconds: Number(process.env.DARKNESS_TIMEOUT_SECONDS) || 20,

  plantGrowingMilliseconds: Number(process.env.PLANT_GROWING_MILLISECONDS) || 5000
}