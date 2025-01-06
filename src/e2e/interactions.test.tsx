import { SudokuConfig } from "@/config";
import { render, screen, waitFor } from "@testing-library/react";
import PlayArea from "@/app/playarea/playArea";
import '@testing-library/jest-dom';
import * as React from "react";
import { draftText, easyText, writeText } from "@/text";

describe('UI Interactions', () => {
  let config: SudokuConfig
  beforeEach(() => {
    config = {
      mode: 'NORMAL',
      startingNumberOfLives: 3,
      preselectedSudoku: 4, // We select this sudoku to avoid randomness
      itemDisplayTimeoutMilliseconds: 1000,
      mistakeTimeoutMilliseconds: 1000,
    }
  })
  describe('Starting a new game', () => {
    it('Initial state', async () => {
      render(<PlayArea config={config}/>)

      expect(screen.getByText('❤️'.repeat(config.startingNumberOfLives))).toBeInTheDocument()

      expect(screen.getByText(writeText).classList.contains('bg-draft-selected-light')).toBe(true)
      expect(screen.getByText(draftText).classList.contains('bg-draft-selected-light')).toBe(false)

      expect(screen.getByTestId('cell-00').classList.contains('bg-sudoku-selected-light')).toBe(true)

      expect(screen.getByTestId('cell-01').classList.contains('bg-sudoku-highlight-light')).toBe(true)
      expect(screen.getByTestId('cell-02').classList.contains('bg-sudoku-highlight-light')).toBe(true)
      expect(screen.getByTestId('cell-10').classList.contains('bg-sudoku-highlight-light')).toBe(true)
      expect(screen.getByTestId('cell-11').classList.contains('bg-sudoku-highlight-light')).toBe(true)
      expect(screen.getByTestId('cell-12').classList.contains('bg-sudoku-highlight-light')).toBe(true)
      expect(screen.getByTestId('cell-20').classList.contains('bg-sudoku-highlight-light')).toBe(true)
      expect(screen.getByTestId('cell-21').classList.contains('bg-sudoku-highlight-light')).toBe(true)
      expect(screen.getByTestId('cell-22').classList.contains('bg-sudoku-highlight-light')).toBe(true)

      expect(screen.getByTestId('cell-03').classList.contains('bg-sudoku-highlight-light')).toBe(true)
      expect(screen.getByTestId('cell-04').classList.contains('bg-sudoku-highlight-light')).toBe(true)
      expect(screen.getByTestId('cell-05').classList.contains('bg-sudoku-highlight-light')).toBe(true)
      expect(screen.getByTestId('cell-06').classList.contains('bg-sudoku-highlight-light')).toBe(true)
      expect(screen.getByTestId('cell-07').classList.contains('bg-sudoku-highlight-light')).toBe(true)
      expect(screen.getByTestId('cell-08').classList.contains('bg-sudoku-highlight-light')).toBe(true)

      expect(screen.getByTestId('cell-30').classList.contains('bg-sudoku-highlight-light')).toBe(true)
      expect(screen.getByTestId('cell-40').classList.contains('bg-sudoku-highlight-light')).toBe(true)
      expect(screen.getByTestId('cell-50').classList.contains('bg-sudoku-highlight-light')).toBe(true)
      expect(screen.getByTestId('cell-60').classList.contains('bg-sudoku-highlight-light')).toBe(true)
      expect(screen.getByTestId('cell-70').classList.contains('bg-sudoku-highlight-light')).toBe(true)
      expect(screen.getByTestId('cell-80').classList.contains('bg-sudoku-highlight-light')).toBe(true)
    })

    it.skip('Confirm start a new game', () => {
      render(<PlayArea config={config}/>)

      screen.getByText(easyText).click()
      // Write is selected
      // Pre selected tile
      // Items available
      // Negative effects
      // Number of hearts
    })

    it.skip('Confirm start a new game mid-way through an existing game', () => {
      // Write is selected
      // Pre selected tile
      // Items available
      // Negative effects
      // Number of hearts
    })

    it.skip('Reject start a new game', () => {

    })
  })

  describe.skip('Sudoku grid', () => {
    it('Preselected tile', () => {

    })

    it('Select a fixed tile', () => {

    })

    it('Select a variable tile', () => {

    })
  })

  describe.skip('Writing to a cell which does not have an item', () => {
    it('Writing to a fixed cell via clicking', () => {

    })

    it('Writing an incorrect value to a variable cell via clicking', () => {

    })

    it('Writing a correct value to a variable cell via clicking', () => {

    })

    it('Writing a correct value to a variable cell via typing', () => {

    })
  })

  describe.skip('Drafting to a cell', () => {
    it('Drafting to a fixed cell', () => {

    })

    it('Drafting to a variable cell via clicking', () => {

    })

    it('Drafting to a variable cell which has an item', () => {

    })

    it('Writing a correct value to a cell which has drafts', () => {

    })

    it('Writing an incorrect value to a cell which has drafts', () => {

    })

    it('Drafting to a variable cell via typing', () => {

    })
  })

  describe.skip('Writing to a cell which has an item', () => {
    it('Writing an incorrect value to a cell with an item', () => {

    })

    it('Writing a correct value when the item has not been found before', () => {

    })

    it('Writing a correct value when the item has been found before', () => {

    })
  })
})