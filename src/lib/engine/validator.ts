import { GRID_SIZE, CELLS_PER_SYMBOL } from './types.js'
import type { CellValue, Constraint } from './types.js'

/** Check if the board is fully and correctly solved */
export function checkWin(
  board: CellValue[],
  hConstraints: Constraint[][],
  vConstraints: Constraint[][],
): boolean {
  // All cells must be filled
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '.') return false
  }

  for (let i = 0; i < GRID_SIZE; i++) {
    let rowO = 0, rowX = 0, colO = 0, colX = 0
    for (let j = 0; j < GRID_SIZE; j++) {
      if (board[i * GRID_SIZE + j] === 'O') rowO++
      else rowX++
      if (board[j * GRID_SIZE + i] === 'O') colO++
      else colX++
    }
    if (rowO !== CELLS_PER_SYMBOL || rowX !== CELLS_PER_SYMBOL) return false
    if (colO !== CELLS_PER_SYMBOL || colX !== CELLS_PER_SYMBOL) return false
  }

  // No three consecutive same symbols in any row
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c <= GRID_SIZE - 3; c++) {
      const a = board[r * GRID_SIZE + c]
      if (a === board[r * GRID_SIZE + c + 1] && a === board[r * GRID_SIZE + c + 2]) return false
    }
  }

  // No three consecutive same symbols in any column
  for (let c = 0; c < GRID_SIZE; c++) {
    for (let r = 0; r <= GRID_SIZE - 3; r++) {
      const a = board[r * GRID_SIZE + c]
      if (a === board[(r + 1) * GRID_SIZE + c] && a === board[(r + 2) * GRID_SIZE + c]) return false
    }
  }

  // Check horizontal constraints
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE - 1; c++) {
      const constraint = hConstraints[r][c]
      const left = board[r * GRID_SIZE + c]
      const right = board[r * GRID_SIZE + c + 1]
      if (constraint === '=' && left !== right) return false
      if (constraint === 'x' && left === right) return false
    }
  }

  // Check vertical constraints
  for (let r = 0; r < GRID_SIZE - 1; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const constraint = vConstraints[r][c]
      const top = board[r * GRID_SIZE + c]
      const bottom = board[(r + 1) * GRID_SIZE + c]
      if (constraint === '=' && top !== bottom) return false
      if (constraint === 'x' && top === bottom) return false
    }
  }

  return true
}
