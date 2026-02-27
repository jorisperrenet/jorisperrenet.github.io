<script lang="ts">
  import "../../app.css";

  // ── Types & constants ──────────────────────────────────────────────
  type CellValue = 'O' | 'X' | '.'
  type Constraint = '=' | 'x' | '.'
  type Difficulty = 'medium' | 'hard' | 'extreme' | 'extreme+'
  type Domain = CellValue[]

  interface Puzzle {
    board: CellValue[]
    solution: CellValue[]
    hConstraints: Constraint[][]
    vConstraints: Constraint[][]
    difficulty: Difficulty
  }

  interface Move {
    index: number
    previousValue: CellValue
  }

  interface DifficultyConfig {
    minRemoved: number
    maxRemoved: number
  }

  const GRID_SIZE = 6
  const CELLS_PER_SYMBOL = 3

  const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
    medium:     { minRemoved: 24, maxRemoved: 30 },
    hard:       { minRemoved: 28, maxRemoved: 34 },
    extreme:    { minRemoved: 32, maxRemoved: 36 },
    'extreme+': { minRemoved: 28, maxRemoved: 36 },
  }

  const DIFFICULTIES: Difficulty[] = ['medium', 'hard', 'extreme', 'extreme+']

  // ── Solver ─────────────────────────────────────────────────────────
  function solve(
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

  function propagate(
    domains: Domain[],
    hConstraints: Constraint[][],
    vConstraints: Constraint[][],
  ): boolean {
    let changed = true
    while (changed) {
      changed = false

      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE - 1; c++) {
          const con = hConstraints[r][c]
          if (con === '.') continue
          const i = r * GRID_SIZE + c
          const res = applyEdgeConstraint(domains, i, i + 1, con)
          if (!res.ok) return false
          if (res.changed) changed = true
        }
      }
      for (let r = 0; r < GRID_SIZE - 1; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          const con = vConstraints[r][c]
          if (con === '.') continue
          const i = r * GRID_SIZE + c
          const res = applyEdgeConstraint(domains, i, i + GRID_SIZE, con)
          if (!res.ok) return false
          if (res.changed) changed = true
        }
      }

      for (let i = 0; i < GRID_SIZE; i++) {
        const rr = saturateLine(domains, i, true)
        if (!rr.ok) return false
        if (rr.changed) changed = true
        const cr = saturateLine(domains, i, false)
        if (!cr.ok) return false
        if (cr.changed) changed = true
      }

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

      for (let idx = 0; idx < domains.length; idx++) {
        if (domains[idx].length === 0) return false
      }
    }
    return true
  }

  function applyNoThreeConsecutive(
    domains: Domain[], a: number, b: number, c: number,
  ): { ok: boolean; changed: boolean } {
    let changed = false

    if (domains[a].length === 1 && domains[b].length === 1 && domains[a][0] === domains[b][0]) {
      const other: CellValue = domains[a][0] === 'O' ? 'X' : 'O'
      if (domains[c].length === 1) {
        if (domains[c][0] !== other) return { ok: false, changed }
      } else { domains[c] = [other]; changed = true }
    }

    if (domains[b].length === 1 && domains[c].length === 1 && domains[b][0] === domains[c][0]) {
      const other: CellValue = domains[b][0] === 'O' ? 'X' : 'O'
      if (domains[a].length === 1) {
        if (domains[a][0] !== other) return { ok: false, changed }
      } else { domains[a] = [other]; changed = true }
    }

    if (domains[a].length === 1 && domains[c].length === 1 && domains[a][0] === domains[c][0]) {
      const other: CellValue = domains[a][0] === 'O' ? 'X' : 'O'
      if (domains[b].length === 1) {
        if (domains[b][0] !== other) return { ok: false, changed }
      } else { domains[b] = [other]; changed = true }
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
        if (domains[idx][0] === 'O') countO++; else countX++
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
    let bestIdx = -1, bestSize = Infinity
    for (let i = 0; i < domains.length; i++) {
      if (domains[i].length > 1 && domains[i].length < bestSize) {
        bestSize = domains[i].length; bestIdx = i
      }
    }
    if (bestIdx === -1) {
      const board = domains.map(d => d[0])
      if (isValidComplete(board, hConstraints, vConstraints)) solutions.push(board)
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
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c <= GRID_SIZE - 3; c++) {
        const v = board[r * GRID_SIZE + c]
        if (v === board[r * GRID_SIZE + c + 1] && v === board[r * GRID_SIZE + c + 2]) return false
      }
    }
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

  // ── Generator ──────────────────────────────────────────────────────
  function generatePuzzle(difficulty: Difficulty): Puzzle {
    const config = DIFFICULTY_CONFIG[difficulty]
    const solution = generateCompleteBoard()

    if (difficulty === 'extreme+') {
      const { hConstraints, vConstraints } = emptyConstraints()
      const board = removeCells(solution, hConstraints, vConstraints, config.minRemoved, config.maxRemoved)
      return { board, solution, hConstraints, vConstraints, difficulty }
    }

    const { hConstraints, vConstraints } = placeAllConstraints(solution)
    const board = removeCells(solution, hConstraints, vConstraints, config.minRemoved, config.maxRemoved)
    pruneConstraints(board, hConstraints, vConstraints)
    return { board, solution, hConstraints, vConstraints, difficulty }
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

  function generateCompleteBoard(): CellValue[] {
    const board: CellValue[] = new Array(GRID_SIZE * GRID_SIZE).fill('.')
    const colCounts = new Array(GRID_SIZE).fill(0)
    if (fillRow(board, colCounts, 0)) return board
    return generateCompleteBoard()
  }

  function fillRow(board: CellValue[], colCounts: number[], row: number): boolean {
    if (row === GRID_SIZE) return true
    const positions = [0, 1, 2, 3, 4, 5]
    const combos = combinations(positions, CELLS_PER_SYMBOL)
    shuffle(combos)

    for (const oPositions of combos) {
      const oSet = new Set(oPositions)
      let valid = true

      const rowValues: CellValue[] = []
      for (let c = 0; c < GRID_SIZE; c++) rowValues.push(oSet.has(c) ? 'O' : 'X')

      for (let c = 0; c < GRID_SIZE; c++) {
        const isO = oSet.has(c)
        if (isO && colCounts[c] >= CELLS_PER_SYMBOL) { valid = false; break }
        if (!isO && (row - colCounts[c]) >= CELLS_PER_SYMBOL) { valid = false; break }
      }
      if (!valid) continue

      for (let c = 0; c <= GRID_SIZE - 3; c++) {
        if (rowValues[c] === rowValues[c + 1] && rowValues[c] === rowValues[c + 2]) { valid = false; break }
      }
      if (!valid) continue

      if (row >= 2) {
        for (let c = 0; c < GRID_SIZE; c++) {
          const prev1 = board[(row - 1) * GRID_SIZE + c]
          const prev2 = board[(row - 2) * GRID_SIZE + c]
          if (rowValues[c] === prev1 && rowValues[c] === prev2) { valid = false; break }
        }
      }
      if (!valid) continue

      for (let c = 0; c < GRID_SIZE; c++) {
        board[row * GRID_SIZE + c] = oSet.has(c) ? 'O' : 'X'
        if (oSet.has(c)) colCounts[c]++
      }
      if (fillRow(board, colCounts, row + 1)) return true
      for (let c = 0; c < GRID_SIZE; c++) {
        board[row * GRID_SIZE + c] = '.'
        if (oSet.has(c)) colCounts[c]--
      }
    }
    return false
  }

  function combinations(arr: number[], k: number): number[][] {
    if (k === 0) return [[]]
    if (arr.length < k) return []
    const result: number[][] = []
    const [first, ...rest] = arr
    for (const combo of combinations(rest, k - 1)) result.push([first, ...combo])
    result.push(...combinations(rest, k))
    return result
  }

  function placeAllConstraints(solution: CellValue[]) {
    const hConstraints: Constraint[][] = Array.from({ length: GRID_SIZE }, () => new Array(GRID_SIZE - 1).fill('.'))
    const vConstraints: Constraint[][] = Array.from({ length: GRID_SIZE - 1 }, () => new Array(GRID_SIZE).fill('.'))
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - 1; c++) {
        hConstraints[r][c] = solution[r * GRID_SIZE + c] === solution[r * GRID_SIZE + c + 1] ? '=' : 'x'
      }
    }
    for (let r = 0; r < GRID_SIZE - 1; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        vConstraints[r][c] = solution[r * GRID_SIZE + c] === solution[(r + 1) * GRID_SIZE + c] ? '=' : 'x'
      }
    }
    return { hConstraints, vConstraints }
  }

  function pruneConstraints(board: CellValue[], hConstraints: Constraint[][], vConstraints: Constraint[][]): void {
    const edges: { type: 'h' | 'v'; r: number; c: number }[] = []
    for (let r = 0; r < GRID_SIZE; r++)
      for (let c = 0; c < GRID_SIZE - 1; c++)
        if (hConstraints[r][c] !== '.') edges.push({ type: 'h', r, c })
    for (let r = 0; r < GRID_SIZE - 1; r++)
      for (let c = 0; c < GRID_SIZE; c++)
        if (vConstraints[r][c] !== '.') edges.push({ type: 'v', r, c })
    shuffle(edges)

    for (const edge of edges) {
      const arr = edge.type === 'h' ? hConstraints : vConstraints
      const saved = arr[edge.r][edge.c]
      arr[edge.r][edge.c] = '.'
      const solutions = solve(board, hConstraints, vConstraints, 2)
      if (solutions.length !== 1) arr[edge.r][edge.c] = saved
    }
  }

  function removeCells(
    solution: CellValue[], hConstraints: Constraint[][], vConstraints: Constraint[][],
    minRemoved: number, maxRemoved: number,
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
      const solutions = solve(board, hConstraints, vConstraints, 2)
      if (solutions.length === 1) removed++
      else board[idx] = saved
    }
    return board
  }

  function shuffle<T>(arr: T[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }

  // ── Validator ──────────────────────────────────────────────────────
  function checkWin(board: CellValue[], hConstraints: Constraint[][], vConstraints: Constraint[][]): boolean {
    for (let i = 0; i < board.length; i++) if (board[i] === '.') return false
    for (let i = 0; i < GRID_SIZE; i++) {
      let rowO = 0, rowX = 0, colO = 0, colX = 0
      for (let j = 0; j < GRID_SIZE; j++) {
        if (board[i * GRID_SIZE + j] === 'O') rowO++; else rowX++
        if (board[j * GRID_SIZE + i] === 'O') colO++; else colX++
      }
      if (rowO !== CELLS_PER_SYMBOL || rowX !== CELLS_PER_SYMBOL) return false
      if (colO !== CELLS_PER_SYMBOL || colX !== CELLS_PER_SYMBOL) return false
    }
    for (let r = 0; r < GRID_SIZE; r++)
      for (let c = 0; c <= GRID_SIZE - 3; c++) {
        const a = board[r * GRID_SIZE + c]
        if (a === board[r * GRID_SIZE + c + 1] && a === board[r * GRID_SIZE + c + 2]) return false
      }
    for (let c = 0; c < GRID_SIZE; c++)
      for (let r = 0; r <= GRID_SIZE - 3; r++) {
        const a = board[r * GRID_SIZE + c]
        if (a === board[(r + 1) * GRID_SIZE + c] && a === board[(r + 2) * GRID_SIZE + c]) return false
      }
    for (let r = 0; r < GRID_SIZE; r++)
      for (let c = 0; c < GRID_SIZE - 1; c++) {
        const con = hConstraints[r][c]
        if (con === '=' && board[r * GRID_SIZE + c] !== board[r * GRID_SIZE + c + 1]) return false
        if (con === 'x' && board[r * GRID_SIZE + c] === board[r * GRID_SIZE + c + 1]) return false
      }
    for (let r = 0; r < GRID_SIZE - 1; r++)
      for (let c = 0; c < GRID_SIZE; c++) {
        const con = vConstraints[r][c]
        if (con === '=' && board[r * GRID_SIZE + c] !== board[(r + 1) * GRID_SIZE + c]) return false
        if (con === 'x' && board[r * GRID_SIZE + c] === board[(r + 1) * GRID_SIZE + c]) return false
      }
    return true
  }

  // ── Game state ─────────────────────────────────────────────────────
  let board = $state<CellValue[]>([])
  let initialBoard = $state<CellValue[]>([])
  let hConstraints = $state<Constraint[][]>([])
  let vConstraints = $state<Constraint[][]>([])
  let moves = $state<Move[]>([])
  let difficulty = $state<Difficulty>('hard')
  let elapsed = $state(0)
  let won = $state(false)
  let loading = $state(true)
  let timerInterval: ReturnType<typeof setInterval> | null = null

  let locked = $derived(initialBoard.map(v => v !== '.'))
  let formattedTime = $derived(() => {
    const mins = Math.floor(elapsed / 60)
    const secs = elapsed % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  })

  function startTimer() {
    stopTimer()
    elapsed = 0
    timerInterval = setInterval(() => { elapsed++ }, 1000)
  }

  function stopTimer() {
    if (timerInterval !== null) { clearInterval(timerInterval); timerInterval = null }
  }

  function newGame(d: Difficulty) {
    difficulty = d
    loading = true
    stopTimer()

    setTimeout(() => {
      const puzzle = generatePuzzle(d)
      board = [...puzzle.board]
      initialBoard = [...puzzle.board]
      hConstraints = puzzle.hConstraints
      vConstraints = puzzle.vConstraints
      moves = []
      won = false
      elapsed = 0
      loading = false
      startTimer()
    }, 20)
  }

  function toggleCell(index: number, forward: boolean) {
    if (won || locked[index]) return
    const prev = board[index]
    const cycle: CellValue[] = forward ? ['O', 'X', '.'] : ['.', 'X', 'O']
    const currentIdx = cycle.indexOf(prev)
    const next = cycle[(currentIdx + 1) % cycle.length]
    moves = [...moves, { index, previousValue: prev }]
    board[index] = next
    if (checkWin(board, hConstraints, vConstraints)) { won = true; stopTimer() }
  }

  function undo() {
    if (moves.length === 0) return
    const move = moves[moves.length - 1]
    moves = moves.slice(0, -1)
    board[move.index] = move.previousValue
  }

  function clear() {
    board = [...initialBoard]
    moves = []
  }

  async function share() {
    const text = `I completed a Tango puzzle in ${formattedTime()}!`
    if (navigator.share) {
      try { await navigator.share({ text }) } catch {}
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  function handleCellClick(e: MouseEvent, i: number) {
    e.preventDefault()
    if (!locked[i]) toggleCell(i, true)
  }

  function handleCellContext(e: MouseEvent, i: number) {
    e.preventDefault()
    if (!locked[i]) toggleCell(i, false)
  }

  // Start first game
  newGame('hard')
</script>

<main class="min-h-svh bg-stone-50 flex items-start justify-center pt-10 pb-16 select-none">
  <div class="flex flex-col items-center gap-5 w-full max-w-sm mx-auto px-4">
    <h1 class="text-3xl font-bold text-stone-800 tracking-tight">Tango</h1>

    <!-- Difficulty selector + Timer -->
    <div class="flex items-center gap-4 w-full justify-between">
      <div class="flex gap-1 bg-stone-100 p-1 rounded-xl">
        {#each DIFFICULTIES as option}
          <button
            class="px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all cursor-pointer
              {difficulty === option
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'}"
            onclick={() => newGame(option)}
          >
            {option}
          </button>
        {/each}
      </div>

      <div class="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full text-sm font-mono text-stone-600">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        {formattedTime()}
      </div>
    </div>

    <!-- Board -->
    <div class="w-full">
      {#if loading}
        <div class="aspect-square rounded-xl bg-stone-200 p-1 flex items-center justify-center">
          <span class="text-stone-400 text-lg">Generating…</span>
        </div>
      {:else}
        <div class="grid grid-cols-6 gap-1 bg-stone-200 p-1 rounded-xl aspect-square">
          {#each board as value, i}
            {@const row = Math.floor(i / GRID_SIZE)}
            {@const col = i % GRID_SIZE}
            <div class="relative">
              <button
                class="aspect-square w-full flex items-center justify-center rounded-sm transition-colors
                  {locked[i] ? 'bg-stone-100 cursor-default' : 'bg-white cursor-pointer hover:bg-stone-50 active:bg-stone-100'}"
                onclick={(e) => handleCellClick(e, i)}
                oncontextmenu={(e) => handleCellContext(e, i)}
              >
                {#if value === 'O'}
                  <svg class="w-3/5 h-3/5 text-amber-400 drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                {:else if value === 'X'}
                  <svg class="w-3/5 h-3/5 text-indigo-400 drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                {/if}
              </button>

              {#if col < GRID_SIZE - 1 && hConstraints[row][col] !== '.'}
                <span class="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-10
                  text-[10px] font-bold text-stone-500 bg-stone-200 rounded-full w-4 h-4
                  flex items-center justify-center pointer-events-none leading-none">
                  {hConstraints[row][col]}
                </span>
              {/if}

              {#if row < GRID_SIZE - 1 && vConstraints[row][col] !== '.'}
                <span class="absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 z-10
                  text-[10px] font-bold text-stone-500 bg-stone-200 rounded-full w-4 h-4
                  flex items-center justify-center pointer-events-none leading-none">
                  {vConstraints[row][col]}
                </span>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Controls -->
    <div class="flex gap-3">
      <button
        class="px-5 py-2 rounded-xl bg-stone-100 text-stone-700 font-medium hover:bg-stone-200 transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        onclick={undo}
        disabled={loading || moves.length === 0}
      >
        Undo
      </button>
      <button
        class="px-5 py-2 rounded-xl bg-stone-100 text-stone-700 font-medium hover:bg-stone-200 transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        onclick={clear}
        disabled={loading}
      >
        Clear
      </button>
    </div>
  </div>

  <!-- Win modal -->
  {#if won}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl p-8 mx-4 max-w-sm w-full text-center space-y-5">
        <h2 class="text-2xl font-bold text-stone-800">Puzzle Complete!</h2>
        <p class="text-stone-500">Solved in <span class="font-mono font-semibold text-stone-700">{formattedTime()}</span></p>

        <div class="flex gap-3 justify-center">
          <button
            class="px-5 py-2.5 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors cursor-pointer"
            onclick={share}
          >
            Share
          </button>
          <button
            class="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-medium hover:bg-stone-200 transition-colors cursor-pointer"
            onclick={() => newGame(difficulty)}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  {/if}
</main>
