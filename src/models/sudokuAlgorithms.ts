import { Cell, CellType, CellValue } from "./sudoku";
import * as sudoku from 'sudoku';
import { MistakeError } from "../errors/mistake";

export function createSudokuAlgorithm(grid: CellValue[][]): Cell[][] {
  if (grid.length != 9) {
    throw new Error('Wrong size sudoku')
  }
  for (const idx in grid) {
    if (grid[idx].length != 9) {
      throw new Error('Wrong size sudoku')
    }
  }

  const cells: Cell[][] = Array.from({ length: 9 }, _r => Array.from({ length: 9 }, _c => Cell.createVariable(null)))
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const value = grid[r][c]
      if (value) {
        cells[r][c] = Cell.createdFixed(value)
      }
    }
  }

  return cells
}

export function solveAlgorithm(cells: Cell[][]): Cell[][] {
  const flatMapGrid = cells.flatMap(x => x).map(x => x?.value ? Number.parseInt(x.value) - 1 : null)
  const solution = (sudoku.solvepuzzle(flatMapGrid) as number[]).map(x => (x + 1).toString() as CellValue)
  const solvedGrid = []
  for (let i = 0; i < solution.length; i += 9) {
    const chunk = solution.slice(i, i + 9);
    solvedGrid.push(chunk)
  }

  const newCells = cells
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = newCells[r][c]
      if(cell.cellType === CellType.Variable) {
        newCells[r][c] = cell.updateValue(solvedGrid[r][c])
      }
    }
  }
  return newCells
}

export function findErrorsAlgorithm(cells: Cell[][], solution: Cell[][]): [number, number, CellValue][] {
  const mistakes: [number, number, CellValue][] = []
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = cells[r][c]
      if (!cell.value) continue

      if (cell.value !== solution[r][c].value) {
        mistakes.push([r, c, solution[r][c].value])
      }
    }
  }

  return mistakes
}

export function getHintAlgorithm(cells: Cell[][], solved: Cell[][]): [number, number, CellValue] {
  let possibilities = Array.from(
    { length: 9 }, _r => Array.from(
      { length: 9 }, _c => new Set<CellValue>(['1', '2', '3', '4', '5', '6', '7', '8', '9'])
    )
  )

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (!cells[r][c].value || cells[r][c].value !== solved[r][c].value) {
        continue
      }
      possibilities = removePossibilityFromOtherCells(possibilities, r, c, cells[r][c].value)
    }
  }

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (possibilities[r][c].size === 1) {
          const value = [...possibilities[r][c]][0]
          return [r, c, value]
        }
        if (possibilities[r][c].size === 0) continue
  
        possibilities = narrowDownPossibilities(possibilities, cells, r, c)
        if (possibilities[r][c].size === 1) {
          const value = [...possibilities[r][c]][0]
          return [r, c, value]
        }
      }
  }
  return checkForOnlyPossibilties(possibilities)
}

function removePossibilityFromOtherCells(possibilities: Set<CellValue>[][], r: number, c: number, value: CellValue): Set<CellValue>[][] {
  for (let rIterator = 0; rIterator < 9; rIterator++) {
    possibilities[rIterator][c].delete(value)
  }

  for (let cIterator = 0; cIterator < 9; cIterator++) {
    possibilities[r][cIterator].delete(value)
  }

 const [minR, maxR] = get3x3Range(r)
 const [minC, maxC] = get3x3Range(c)
 for (let rIterator = minR; rIterator <= maxR; rIterator++) {
    for (let cIterator = minC; cIterator <= maxC; cIterator++) {
      possibilities[rIterator][cIterator].delete(value)
    }
  }

  possibilities[r][c] = new Set()
  return possibilities
}

function narrowDownPossibilities(possibilities: Set<CellValue>[][], cells: Cell[][], r: number, c: number): Set<CellValue>[][] {
  let valuesInRow = new Set()
  for (let rIterator = 0; rIterator < 9; rIterator++) {
    valuesInRow.add(cells[rIterator][c].value)
  }

  let valuesInCol = new Set()
  for (let cIterator = 0; cIterator < 9; cIterator++) {
    valuesInCol.add(cells[r][cIterator].value)
  }

  let valuesIn3x3 = new Set()
  const [minR, maxR] = get3x3Range(r)
  const [minC, maxC] = get3x3Range(c)
  for (let rIterator = minR; rIterator <= maxR; rIterator++) {
    for (let cIterator = minC; cIterator <= maxC; cIterator++) {
      valuesIn3x3.add(cells[rIterator][cIterator].value)
    }
  }

  const possibleValuesInCell = [...possibilities[r][c]]
  const impossibleValues = new Set([...valuesInRow, ...valuesInCol, ...valuesIn3x3])

  // if (r === 0 && c === 6) {
  //   console.log(possibleValuesInCell)
  //   console.log(impossibleValues)
  // }
  for (let i = 0; i < possibleValuesInCell.length; i++) {
    if (impossibleValues.has(possibleValuesInCell[i])) {
      possibilities[r][c].delete(possibleValuesInCell[i])
    }
  }

  return possibilities
}

function checkForOnlyPossibilties(possibilities: Set<CellValue>[][]):[number, number, CellValue] {
  const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

  for (let c = 0; c < 9; c++) {
    let valuesInRow: [number, number, CellValue][] = []
    for (let rIterator = 0; rIterator < 9; rIterator++) {
      valuesInRow = [...valuesInRow, ...[...possibilities[rIterator][c]].map(x => [rIterator, c, x]) as [number, number, CellValue][]]
    }
    for (let i = 0; i < 9; i++) {
      const value = values[i]
      if (valuesInRow.filter(x => x[2] === value).length === 1) {
        return valuesInRow.filter(x => x[2] === value)[0]
      }
    }
  }

  for (let r = 0; r < 9; r++) {
    let valuesInCol: [number, number, CellValue][] = []
    for (let cIterator = 0; cIterator < 9; cIterator++) {
      valuesInCol = [...valuesInCol, ...[...possibilities[r][cIterator]].map(x => [r, cIterator, x]) as [number, number, CellValue][]]
    }
    for (let i = 0; i < 9; i++) {
      const value = values[i]
      if (valuesInCol.filter(x => x[2] === value).length === 1) {
        return valuesInCol.filter(x => x[2] === value)[0]
      }
    }
  }

  for (let r = 0; r < 9; r += 3) {
    for (let c = 0; c < 9; c+= 3) {
      let valuesIn3x3: [number, number, CellValue][] = []
      const [minR, maxR] = get3x3Range(r)
      const [minC, maxC] = get3x3Range(c)

      for (let i = minR; i <= maxR; i++) {
        for (let j = minC; j <= maxC; j++) {
          valuesIn3x3 = [...valuesIn3x3, ...[...possibilities[i][j]].map(x => [i, j, x]) as [number, number, CellValue][]]
        }
      }
      for (let i = 0; i < 9; i++) {
        const value = values[i]
        if (valuesIn3x3.filter(x => x[2] === value).length === 1) {
          return valuesIn3x3.filter(x => x[2] === value)[0]
        }
      }
    }
  }

  throw new Error('Nada')
}

function get3x3Range(rowOrCol: number): [number, number] {
  if (rowOrCol < 3) {
    return [0, 2]
  }
  if (rowOrCol < 6) {
    return [3, 5]
  }
  return [6, 8]
}