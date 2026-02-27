import { GRID_SIZE, CELLS_PER_SYMBOL } from './types.js'
import type { CellValue, Constraint } from './types.js'

type Domain = CellValue[]

/**
 * Solve a puzzle using constraint propagation + backtracking.
 * Returns up to `maxSolutions` solutions.
 */
export function solve(
  board: CellValue[],
  hConstraints: Constraint[][],
  vConstraints: Constraint[][],
  maxSolutions = 1,
): CellValue[][] {
  const solutions: CellValue[][] = []
  const domains: Domain[] = board.map(v => (v === '.' ? ['O', 'X'] : [v]))

  if (!propagate(domains, hConstraints, vConstraints)) return solutions

  backtrack(domains, hConstraints, vConstraints, solutions, maxSolutions)
  return solutions
}

/** Apply constraint propagation to reduce domains. Returns false if inconsistency found. */
function propagate(
  domains: Domain[],
  hConstraints: Constraint[][],
  vConstraints: Constraint[][],
): boolean {
  let changed = true
  while (changed) {
    changed = false

    // Edge constraints
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - 1; c++) {
        const con = hConstraints[r][c]
        if (con === '.') continue
        const i = r * GRID_SIZE + c
        const j = i + 1
        const res = applyEdgeConstraint(domains, i, j, con)
        if (!res.ok) return false
        if (res.changed) changed = true
      }
    }
    for (let r = 0; r < GRID_SIZE - 1; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const con = vConstraints[r][c]
        if (con === '.') continue
        const i = r * GRID_SIZE + c
        const j = i + GRID_SIZE
        const res = applyEdgeConstraint(domains, i, j, con)
        if (!res.ok) return false
        if (res.changed) changed = true
      }
    }

    // Row/column saturation
    for (let i = 0; i < GRID_SIZE; i++) {
      const rr = saturateLine(domains, i, true)
      if (!rr.ok) return false
      if (rr.changed) changed = true
      const cr = saturateLine(domains, i, false)
      if (!cr.ok) return false
      if (cr.changed) changed = true
    }

    // No-three-consecutive constraint propagation
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c <= GRID_SIZE - 3; c++) {
        const res = applyNoThreeConsecutive(domains, r * GRID_SIZE + c, r * GRID_SIZE + c + 1, r * GRID_SIZE + c + 2)
        if (!res.ok) return false
        if (res.changed) changed = true
      }
    }
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r <= GRID_SIZE - 3; r++) {
        const res = applyNoThreeConsecutive(domains, r * GRID_SIZE + c, (r + 1) * GRID_SIZE + c, (r + 2) * GRID_SIZE + c)
        if (!res.ok) return false
        if (res.changed) changed = true
      }
    }

    // Empty domain check
    for (let idx = 0; idx < domains.length; idx++) {
      if (domains[idx].length === 0) return false
    }
  }
  return true
}

/** If two of three consecutive cells are fixed to the same value, the third must be the opposite */
function applyNoThreeConsecutive(
  domains: Domain[], a: number, b: number, c: number,
): { ok: boolean; changed: boolean } {
  let changed = false

  // If a and b are both fixed to same value, c must be opposite
  if (domains[a].length === 1 && domains[b].length === 1 && domains[a][0] === domains[b][0]) {
    const other: CellValue = domains[a][0] === 'O' ? 'X' : 'O'
    if (domains[c].length === 1) {
      if (domains[c][0] !== other) return { ok: false, changed }
    } else {
      domains[c] = [other]
      changed = true
    }
  }

  // If b and c are both fixed to same value, a must be opposite
  if (domains[b].length === 1 && domains[c].length === 1 && domains[b][0] === domains[c][0]) {
    const other: CellValue = domains[b][0] === 'O' ? 'X' : 'O'
    if (domains[a].length === 1) {
      if (domains[a][0] !== other) return { ok: false, changed }
    } else {
      domains[a] = [other]
      changed = true
    }
  }

  // If a and c are both fixed to same value, b must be opposite
  if (domains[a].length === 1 && domains[c].length === 1 && domains[a][0] === domains[c][0]) {
    const other: CellValue = domains[a][0] === 'O' ? 'X' : 'O'
    if (domains[b].length === 1) {
      if (domains[b][0] !== other) return { ok: false, changed }
    } else {
      domains[b] = [other]
      changed = true
    }
  }

  return { ok: true, changed }
}

function applyEdgeConstraint(
  domains: Domain[], i: number, j: number, con: Constraint,
): { ok: boolean; changed: boolean } {
  let changed = false

  if (con === '=') {
    if (domains[i].length === 1) {
      const v = domains[i][0]
      if (!domains[j].includes(v)) return { ok: false, changed }
      if (domains[j].length > 1) { domains[j] = [v]; changed = true }
    }
    if (domains[j].length === 1) {
      const v = domains[j][0]
      if (!domains[i].includes(v)) return { ok: false, changed }
      if (domains[i].length > 1) { domains[i] = [v]; changed = true }
    }
  } else if (con === 'x') {
    if (domains[i].length === 1) {
      const v = domains[i][0]
      const other: CellValue = v === 'O' ? 'X' : 'O'
      if (!domains[j].includes(other)) return { ok: false, changed }
      if (domains[j].length > 1) { domains[j] = [other]; changed = true }
    }
    if (domains[j].length === 1) {
      const v = domains[j][0]
      const other: CellValue = v === 'O' ? 'X' : 'O'
      if (!domains[i].includes(other)) return { ok: false, changed }
      if (domains[i].length > 1) { domains[i] = [other]; changed = true }
    }
  }
  return { ok: true, changed }
}

function saturateLine(
  domains: Domain[], lineIdx: number, isRow: boolean,
): { ok: boolean; changed: boolean } {
  let countO = 0, countX = 0
  let changed = false

  for (let k = 0; k < GRID_SIZE; k++) {
    const idx = isRow ? lineIdx * GRID_SIZE + k : k * GRID_SIZE + lineIdx
    if (domains[idx].length === 1) {
      if (domains[idx][0] === 'O') countO++
      else countX++
    }
  }

  if (countO > CELLS_PER_SYMBOL || countX > CELLS_PER_SYMBOL) return { ok: false, changed }

  if (countO === CELLS_PER_SYMBOL) {
    for (let k = 0; k < GRID_SIZE; k++) {
      const idx = isRow ? lineIdx * GRID_SIZE + k : k * GRID_SIZE + lineIdx
      if (domains[idx].length > 1) { domains[idx] = ['X']; changed = true }
    }
  }
  if (countX === CELLS_PER_SYMBOL) {
    for (let k = 0; k < GRID_SIZE; k++) {
      const idx = isRow ? lineIdx * GRID_SIZE + k : k * GRID_SIZE + lineIdx
      if (domains[idx].length > 1) { domains[idx] = ['O']; changed = true }
    }
  }

  return { ok: true, changed }
}

function backtrack(
  domains: Domain[],
  hConstraints: Constraint[][],
  vConstraints: Constraint[][],
  solutions: CellValue[][],
  maxSolutions: number,
): void {
  if (solutions.length >= maxSolutions) return

  let bestIdx = -1
  let bestSize = Infinity
  for (let i = 0; i < domains.length; i++) {
    if (domains[i].length > 1 && domains[i].length < bestSize) {
      bestSize = domains[i].length
      bestIdx = i
    }
  }

  if (bestIdx === -1) {
    const board = domains.map(d => d[0])
    if (isValidComplete(board, hConstraints, vConstraints)) {
      solutions.push(board)
    }
    return
  }

  for (const value of domains[bestIdx]) {
    const newDomains = domains.map(d => [...d])
    newDomains[bestIdx] = [value]

    if (propagate(newDomains, hConstraints, vConstraints)) {
      backtrack(newDomains, hConstraints, vConstraints, solutions, maxSolutions)
      if (solutions.length >= maxSolutions) return
    }
  }
}

function isValidComplete(
  board: CellValue[],
  hConstraints: Constraint[][],
  vConstraints: Constraint[][],
): boolean {
  for (let i = 0; i < GRID_SIZE; i++) {
    let rowO = 0, colO = 0
    for (let j = 0; j < GRID_SIZE; j++) {
      if (board[i * GRID_SIZE + j] === 'O') rowO++
      if (board[j * GRID_SIZE + i] === 'O') colO++
    }
    if (rowO !== CELLS_PER_SYMBOL || colO !== CELLS_PER_SYMBOL) return false
  }

  // No three consecutive in rows
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c <= GRID_SIZE - 3; c++) {
      const v = board[r * GRID_SIZE + c]
      if (v === board[r * GRID_SIZE + c + 1] && v === board[r * GRID_SIZE + c + 2]) return false
    }
  }

  // No three consecutive in columns
  for (let c = 0; c < GRID_SIZE; c++) {
    for (let r = 0; r <= GRID_SIZE - 3; r++) {
      const v = board[r * GRID_SIZE + c]
      if (v === board[(r + 1) * GRID_SIZE + c] && v === board[(r + 2) * GRID_SIZE + c]) return false
    }
  }

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE - 1; c++) {
      const con = hConstraints[r][c]
      if (con === '=' && board[r * GRID_SIZE + c] !== board[r * GRID_SIZE + c + 1]) return false
      if (con === 'x' && board[r * GRID_SIZE + c] === board[r * GRID_SIZE + c + 1]) return false
    }
  }

  for (let r = 0; r < GRID_SIZE - 1; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const con = vConstraints[r][c]
      if (con === '=' && board[r * GRID_SIZE + c] !== board[(r + 1) * GRID_SIZE + c]) return false
      if (con === 'x' && board[r * GRID_SIZE + c] === board[(r + 1) * GRID_SIZE + c]) return false
    }
  }

  return true
}
