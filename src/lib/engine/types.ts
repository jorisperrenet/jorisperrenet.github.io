export type CellValue = 'O' | 'X' | '.'

export type Constraint = '=' | 'x' | '.'

export type Difficulty = 'medium' | 'hard' | 'extreme' | 'extreme+'

export interface Puzzle {
  /** 6x6 board with pre-filled cells ('O', 'X') and blanks ('.') */
  board: CellValue[]
  /** The complete solution */
  solution: CellValue[]
  /** Horizontal constraints: [row][col] for edge between (row,col) and (row,col+1). 6 rows x 5 cols */
  hConstraints: Constraint[][]
  /** Vertical constraints: [row][col] for edge between (row,col) and (row+1,col). 5 rows x 6 cols */
  vConstraints: Constraint[][]
  difficulty: Difficulty
}

export interface Move {
  index: number
  previousValue: CellValue
}

export const GRID_SIZE = 6
export const CELLS_PER_SYMBOL = 3
