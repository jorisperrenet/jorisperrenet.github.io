import type { CellValue, Constraint, Difficulty, Move, Puzzle } from '../engine/types.js'
import { GRID_SIZE } from '../engine/types.js'
import { generatePuzzle } from '../engine/generator.js'
import { checkWin } from '../engine/validator.js'

class GameState {
  board = $state<CellValue[]>([])
  initialBoard = $state<CellValue[]>([])
  solution = $state<CellValue[]>([])
  hConstraints = $state<Constraint[][]>([])
  vConstraints = $state<Constraint[][]>([])
  moves = $state<Move[]>([])
  difficulty = $state<Difficulty>('hard')
  elapsed = $state(0)
  won = $state(false)

  private timerInterval: ReturnType<typeof setInterval> | null = null

  readonly locked = $derived(
    this.initialBoard.map(v => v !== '.'),
  )

  readonly isWon = $derived(this.won)

  constructor() {
    this.newGame('hard')
  }

  newGame(difficulty: Difficulty) {
    this.difficulty = difficulty
    const puzzle: Puzzle = generatePuzzle(difficulty)
    this.board = [...puzzle.board]
    this.initialBoard = [...puzzle.board]
    this.solution = [...puzzle.solution]
    this.hConstraints = puzzle.hConstraints
    this.vConstraints = puzzle.vConstraints
    this.moves = []
    this.won = false
    this.elapsed = 0
    this.startTimer()
  }

  toggleCell(index: number, forward: boolean) {
    if (this.won) return
    if (this.locked[index]) return

    const prev = this.board[index]
    const cycle: CellValue[] = forward ? ['O', 'X', '.'] : ['.', 'X', 'O']
    const currentIdx = cycle.indexOf(prev)
    const next = cycle[(currentIdx + 1) % cycle.length]

    this.moves = [...this.moves, { index, previousValue: prev }]
    this.board[index] = next

    this.checkWinCondition()
  }

  undo() {
    if (this.moves.length === 0) return

    const move = this.moves[this.moves.length - 1]
    this.moves = this.moves.slice(0, -1)
    this.board[move.index] = move.previousValue
  }

  clear() {
    this.board = [...this.initialBoard]
    this.moves = []
  }

  private checkWinCondition() {
    if (checkWin(this.board, this.hConstraints, this.vConstraints)) {
      this.won = true
      this.stopTimer()
    }
  }

  private startTimer() {
    this.stopTimer()
    this.elapsed = 0
    this.timerInterval = setInterval(() => {
      this.elapsed++
    }, 1000)
  }

  private stopTimer() {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
  }

  get formattedTime(): string {
    const mins = Math.floor(this.elapsed / 60)
    const secs = this.elapsed % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  destroy() {
    this.stopTimer()
  }
}

export const gameState = new GameState()
