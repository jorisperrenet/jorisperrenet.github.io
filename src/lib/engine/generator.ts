import { GRID_SIZE, CELLS_PER_SYMBOL } from './types.js'
import type { CellValue, Constraint, Difficulty, Puzzle } from './types.js'
import { solve } from './solver.js'

interface DifficultyConfig {
  minRemoved: number
  maxRemoved: number
}

const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  medium:    { minRemoved: 24, maxRemoved: 30 },
  hard:      { minRemoved: 28, maxRemoved: 34 },
  extreme:   { minRemoved: 32, maxRemoved: 36 },
  'extreme+': { minRemoved: 28, maxRemoved: 36 },
}

function emptyConstraints() {
  return {
    hConstraints: Array.from({ length: GRID_SIZE }, () =>
      new Array(GRID_SIZE - 1).fill('.') as Constraint[],
    ),
    vConstraints: Array.from({ length: GRID_SIZE - 1 }, () =>
      new Array(GRID_SIZE).fill('.') as Constraint[],
    ),
  }
}

export function generatePuzzle(difficulty: Difficulty): Puzzle {
  const config = DIFFICULTY_CONFIG[difficulty]
  const solution = generateCompleteBoard()

  if (difficulty === 'extreme+') {
    // No constraints at all — only given cells as clues
    const { hConstraints, vConstraints } = emptyConstraints()
    const board = removeCells(solution, hConstraints, vConstraints, config.minRemoved, config.maxRemoved)
    return { board, solution, hConstraints, vConstraints, difficulty }
  }

  // Place all constraints, remove cells, then prune redundant constraints
  const { hConstraints, vConstraints } = placeAllConstraints(solution)
  const board = removeCells(solution, hConstraints, vConstraints, config.minRemoved, config.maxRemoved)
  pruneConstraints(board, hConstraints, vConstraints)

  return { board, solution, hConstraints, vConstraints, difficulty }
}

/** Generate a valid complete 6x6 board with 3 O's and 3 X's per row and column */
function generateCompleteBoard(): CellValue[] {
  const board: CellValue[] = new Array(GRID_SIZE * GRID_SIZE).fill('.')
  const colCounts = new Array(GRID_SIZE).fill(0) // count of 'O' per column

  if (fillRow(board, colCounts, 0)) {
    return board
  }
  // Should never happen for 6x6, but retry just in case
  return generateCompleteBoard()
}

function fillRow(board: CellValue[], colCounts: number[], row: number): boolean {
  if (row === GRID_SIZE) return true

  // Generate all permutations of 3 O's and 3 X's in a row
  const positions = [0, 1, 2, 3, 4, 5]
  const combos = combinations(positions, CELLS_PER_SYMBOL)
  shuffle(combos)

  for (const oPositions of combos) {
    const oSet = new Set(oPositions)
    let valid = true

    // Build candidate row
    const rowValues: CellValue[] = []
    for (let c = 0; c < GRID_SIZE; c++) {
      rowValues.push(oSet.has(c) ? 'O' : 'X')
    }

    // Check column count constraints
    for (let c = 0; c < GRID_SIZE; c++) {
      const isO = oSet.has(c)
      if (isO && colCounts[c] >= CELLS_PER_SYMBOL) { valid = false; break }
      if (!isO && (row - colCounts[c]) >= CELLS_PER_SYMBOL) { valid = false; break }
    }
    if (!valid) continue

    // Check no three consecutive in this row
    for (let c = 0; c <= GRID_SIZE - 3; c++) {
      if (rowValues[c] === rowValues[c + 1] && rowValues[c] === rowValues[c + 2]) {
        valid = false; break
      }
    }
    if (!valid) continue

    // Check no three consecutive in columns (looking at previous rows)
    if (row >= 2) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const prev1 = board[(row - 1) * GRID_SIZE + c]
        const prev2 = board[(row - 2) * GRID_SIZE + c]
        if (rowValues[c] === prev1 && rowValues[c] === prev2) {
          valid = false; break
        }
      }
    }
    if (!valid) continue

    // Place the row
    for (let c = 0; c < GRID_SIZE; c++) {
      board[row * GRID_SIZE + c] = oSet.has(c) ? 'O' : 'X'
      if (oSet.has(c)) colCounts[c]++
    }

    if (fillRow(board, colCounts, row + 1)) return true

    // Undo
    for (let c = 0; c < GRID_SIZE; c++) {
      board[row * GRID_SIZE + c] = '.'
      if (oSet.has(c)) colCounts[c]--
    }
  }

  return false
}

/** Get all k-element combinations from arr */
function combinations(arr: number[], k: number): number[][] {
  if (k === 0) return [[]]
  if (arr.length < k) return []
  const result: number[][] = []
  const [first, ...rest] = arr
  for (const combo of combinations(rest, k - 1)) {
    result.push([first, ...combo])
  }
  result.push(...combinations(rest, k))
  return result
}

/** Place constraints on ALL edges between adjacent cells */
function placeAllConstraints(
  solution: CellValue[],
): { hConstraints: Constraint[][], vConstraints: Constraint[][] } {
  const hConstraints: Constraint[][] = Array.from({ length: GRID_SIZE }, () =>
    new Array(GRID_SIZE - 1).fill('.'),
  )
  const vConstraints: Constraint[][] = Array.from({ length: GRID_SIZE - 1 }, () =>
    new Array(GRID_SIZE).fill('.'),
  )

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE - 1; c++) {
      const left = solution[r * GRID_SIZE + c]
      const right = solution[r * GRID_SIZE + c + 1]
      hConstraints[r][c] = left === right ? '=' : 'x'
    }
  }
  for (let r = 0; r < GRID_SIZE - 1; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const top = solution[r * GRID_SIZE + c]
      const bottom = solution[(r + 1) * GRID_SIZE + c]
      vConstraints[r][c] = top === bottom ? '=' : 'x'
    }
  }

  return { hConstraints, vConstraints }
}

/** Remove constraints that aren't needed for a unique solution */
function pruneConstraints(
  board: CellValue[],
  hConstraints: Constraint[][],
  vConstraints: Constraint[][],
): void {
  // Collect all placed constraints in random order
  const edges: { type: 'h' | 'v'; r: number; c: number }[] = []
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE - 1; c++) {
      if (hConstraints[r][c] !== '.') edges.push({ type: 'h', r, c })
    }
  }
  for (let r = 0; r < GRID_SIZE - 1; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (vConstraints[r][c] !== '.') edges.push({ type: 'v', r, c })
    }
  }
  shuffle(edges)

  // Try removing each constraint; keep it only if removal breaks uniqueness
  for (const edge of edges) {
    const arr = edge.type === 'h' ? hConstraints : vConstraints
    const saved = arr[edge.r][edge.c]
    arr[edge.r][edge.c] = '.'

    const solutions = solve(board, hConstraints, vConstraints, 2)
    if (solutions.length !== 1) {
      arr[edge.r][edge.c] = saved // This constraint is needed
    }
  }
}

/** Remove cells from the complete board while maintaining unique solution */
function removeCells(
  solution: CellValue[],
  hConstraints: Constraint[][],
  vConstraints: Constraint[][],
  minRemoved: number,
  maxRemoved: number,
): CellValue[] {
  const board = [...solution]
  const indices = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i)
  shuffle(indices)

  let removed = 0
  const target = minRemoved + Math.floor(Math.random() * (maxRemoved - minRemoved + 1))

  for (const idx of indices) {
    if (removed >= target) break

    const saved = board[idx]
    board[idx] = '.'

    // Check if puzzle still has exactly 1 solution
    const solutions = solve(board, hConstraints, vConstraints, 2)
    if (solutions.length === 1) {
      removed++
    } else {
      board[idx] = saved // Restore — removal breaks uniqueness
    }
  }

  return board
}

function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
}
