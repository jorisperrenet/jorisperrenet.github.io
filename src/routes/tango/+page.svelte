<script lang="ts">
  import "../../app.css";

  // ── Types & constants ──────────────────────────────────────────────
  type CellValue = 'O' | 'X' | '.'
  type Constraint = '=' | 'x' | '.'
  type Difficulty = 'medium' | 'hard' | 'extreme' | 'medium-nohint' | 'hard-nohint' | 'extreme-nohint'

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
    noHints?: boolean
    minScore?: number
    maxScore?: number
  }

  const GRID_SIZE = 6
  const CELLS_PER_SYMBOL = 3
  const DIRECT_SCORE = 10
  const INDIRECT_SCORE = 30

  const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
    medium:          { minScore: 10, maxScore: 30 },
    hard:            { minScore: 100 },
    extreme:         { minScore: 150 },
    'medium-nohint': { noHints: true, minScore: 0, maxScore: 0 },
    'hard-nohint':   { noHints: true, minScore: 30, maxScore: 60 },
    'extreme-nohint':{ noHints: true, minScore: 60 },
  }

  const HINT_LEVELS: Difficulty[] = ['medium', 'hard', 'extreme']
  const NOHINT_LEVELS: Difficulty[] = ['medium-nohint', 'hard-nohint', 'extreme-nohint']

  // ── Valid lines ───────────────────────────────────────────────────
  // All 14 valid arrangements of 3 O's and 3 X's with no three consecutive
  const VALID_LINES: CellValue[][] = [
    ['O','O','X','O','X','X'], ['O','O','X','X','O','X'],
    ['O','X','O','O','X','X'], ['O','X','O','X','O','X'],
    ['O','X','O','X','X','O'], ['O','X','X','O','O','X'],
    ['O','X','X','O','X','O'], ['X','O','O','X','O','X'],
    ['X','O','O','X','X','O'], ['X','O','X','O','O','X'],
    ['X','O','X','O','X','O'], ['X','O','X','X','O','O'],
    ['X','X','O','O','X','O'], ['X','X','O','X','O','O'],
  ]

  // ── Board generation ──────────────────────────────────────────────
  function generateCompleteBoard(): CellValue[] {
    const board: CellValue[] = new Array(GRID_SIZE * GRID_SIZE).fill('.')
    const colCounts = new Array(GRID_SIZE).fill(0)

    function fillRow(row: number): boolean {
      if (row === GRID_SIZE) return true
      const order = Array.from({ length: VALID_LINES.length }, (_, i) => i)
      shuffle(order)
      for (const li of order) {
        const line = VALID_LINES[li]
        let valid = true
        for (let c = 0; c < GRID_SIZE; c++) {
          const newO = colCounts[c] + (line[c] === 'O' ? 1 : 0)
          if (newO > CELLS_PER_SYMBOL || (row + 1 - newO) > CELLS_PER_SYMBOL) { valid = false; break }
        }
        if (valid && row >= 2) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (line[c] === board[(row - 1) * GRID_SIZE + c] && line[c] === board[(row - 2) * GRID_SIZE + c]) { valid = false; break }
          }
        }
        if (!valid) continue
        for (let c = 0; c < GRID_SIZE; c++) {
          board[row * GRID_SIZE + c] = line[c]
          if (line[c] === 'O') colCounts[c]++
        }
        if (fillRow(row + 1)) return true
        for (let c = 0; c < GRID_SIZE; c++) {
          board[row * GRID_SIZE + c] = '.'
          if (line[c] === 'O') colCounts[c]--
        }
      }
      return false
    }

    fillRow(0)
    return board
  }

  // ── Line force classification ─────────────────────────────────────
  // Score 0: wrong value immediately violates a visible constraint
  function isFreeForce(
    cells: CellValue[], hints: Constraint[], pos: number, val: CellValue,
  ): boolean {
    const wrong: CellValue = val === 'O' ? 'X' : 'O'
    // Saturation: already 3 of the wrong symbol
    let count = 0
    for (const c of cells) if (c === wrong) count++
    if (count >= CELLS_PER_SYMBOL) return true
    // Triple/sandwich: wrong value creates three consecutive
    if (pos >= 2 && cells[pos - 1] === wrong && cells[pos - 2] === wrong) return true
    if (pos >= 1 && pos <= GRID_SIZE - 2 && cells[pos - 1] === wrong && cells[pos + 1] === wrong) return true
    if (pos <= GRID_SIZE - 3 && cells[pos + 1] === wrong && cells[pos + 2] === wrong) return true
    // Hint: adjacent filled cell + hint directly conflicts
    if (pos > 0 && cells[pos - 1] !== '.') {
      if (hints[pos - 1] === '=' && cells[pos - 1] !== wrong) return true
      if (hints[pos - 1] === 'x' && cells[pos - 1] === wrong) return true
    }
    if (pos < GRID_SIZE - 1 && cells[pos + 1] !== '.') {
      if (hints[pos] === '=' && cells[pos + 1] !== wrong) return true
      if (hints[pos] === 'x' && cells[pos + 1] === wrong) return true
    }
    return false
  }

  // Score DIRECT: wrong value → local propagation → contradiction
  function isDirectForce(
    cells: CellValue[], hints: Constraint[], pos: number, correctVal: CellValue,
  ): boolean {
    const test: (CellValue | null)[] = cells.map(c => c === '.' ? null : c)
    test[pos] = correctVal === 'O' ? 'X' : 'O'
    let changed = true
    while (changed) {
      changed = false
      let oc = 0, xc = 0
      for (const v of test) { if (v === 'O') oc++; if (v === 'X') xc++ }
      if (oc > CELLS_PER_SYMBOL || xc > CELLS_PER_SYMBOL) return true
      if (oc === CELLS_PER_SYMBOL) for (let i = 0; i < GRID_SIZE; i++) if (test[i] === null) { test[i] = 'X'; changed = true }
      if (xc === CELLS_PER_SYMBOL) for (let i = 0; i < GRID_SIZE; i++) if (test[i] === null) { test[i] = 'O'; changed = true }
      for (let i = 0; i <= GRID_SIZE - 3; i++) {
        if (test[i] !== null && test[i] === test[i + 1] && test[i] === test[i + 2]) return true
      }
      for (let i = 0; i < GRID_SIZE - 1; i++) {
        if (test[i] !== null && test[i] === test[i + 1]) {
          const other: CellValue = test[i]! === 'O' ? 'X' : 'O'
          if (i > 0 && test[i - 1] === null) { test[i - 1] = other; changed = true }
          if (i + 2 < GRID_SIZE && test[i + 2] === null) { test[i + 2] = other; changed = true }
        }
      }
      for (let i = 0; i <= GRID_SIZE - 3; i++) {
        if (test[i] !== null && test[i + 2] !== null && test[i] === test[i + 2] && test[i + 1] === null) {
          test[i + 1] = test[i]! === 'O' ? 'X' : 'O'; changed = true
        }
      }
      for (let i = 0; i < GRID_SIZE - 1; i++) {
        if (hints[i] === '=') {
          if (test[i] !== null && test[i + 1] === null) { test[i + 1] = test[i]; changed = true }
          if (test[i + 1] !== null && test[i] === null) { test[i] = test[i + 1]; changed = true }
          if (test[i] !== null && test[i + 1] !== null && test[i] !== test[i + 1]) return true
        } else if (hints[i] === 'x') {
          if (test[i] !== null && test[i + 1] === null) { test[i + 1] = test[i]! === 'O' ? 'X' : 'O'; changed = true }
          if (test[i + 1] !== null && test[i] === null) { test[i] = test[i + 1]! === 'O' ? 'X' : 'O'; changed = true }
          if (test[i] !== null && test[i + 1] !== null && test[i] === test[i + 1]) return true
        }
      }
    }
    return false
  }

  function findCheapestForce(
    board: CellValue[], hC: Constraint[][], vC: Constraint[][],
  ): { cells: { idx: number; val: CellValue }[]; score: number } | null {
    let best: { cells: { idx: number; val: CellValue }[]; score: number } | null = null

    for (let lineIdx = 0; lineIdx < GRID_SIZE; lineIdx++) {
      for (const isRow of [true, false] as const) {
        const indices: number[] = []
        for (let k = 0; k < GRID_SIZE; k++)
          indices.push(isRow ? lineIdx * GRID_SIZE + k : k * GRID_SIZE + lineIdx)

        const hints: Constraint[] = []
        for (let k = 0; k < GRID_SIZE - 1; k++)
          hints.push(isRow ? hC[lineIdx][k] : vC[k][lineIdx])

        const cells = indices.map(i => board[i])
        if (cells.every(c => c !== '.')) continue

        const matching = VALID_LINES.filter(line => {
          for (let i = 0; i < GRID_SIZE; i++)
            if (cells[i] !== '.' && cells[i] !== line[i]) return false
          for (let i = 0; i < GRID_SIZE - 1; i++) {
            if (hints[i] === '=' && line[i] !== line[i + 1]) return false
            if (hints[i] === 'x' && line[i] === line[i + 1]) return false
          }
          return true
        })

        if (matching.length === 0) continue

        const forced: { idx: number; val: CellValue }[] = []
        for (let k = 0; k < GRID_SIZE; k++) {
          if (cells[k] !== '.') continue
          const vals = new Set(matching.map(l => l[k]))
          if (vals.size === 1) forced.push({ idx: indices[k], val: [...vals][0] })
        }
        if (forced.length === 0) continue

        // Classify: free (0) > direct (DIRECT_SCORE) > indirect (INDIRECT_SCORE)
        let score = INDIRECT_SCORE
        for (const { idx, val } of forced) {
          const pos = indices.indexOf(idx)
          if (isFreeForce(cells, hints, pos, val)) { score = 0; break }
        }
        if (score !== 0) {
          for (const { idx, val } of forced) {
            if (isDirectForce(cells, hints, indices.indexOf(idx), val)) { score = DIRECT_SCORE; break }
          }
        }

        if (!best || score < best.score) best = { cells: forced, score }
      }
    }

    return best
  }

  // ── Solver ────────────────────────────────────────────────────────
  function solveWithScoring(
    board: CellValue[], hC: Constraint[][], vC: Constraint[][],
  ): { solved: boolean; score: number } {
    board = [...board]
    let score = 0
    while (true) {
      const force = findCheapestForce(board, hC, vC)
      if (!force) break
      for (const { idx, val } of force.cells) board[idx] = val
      score += force.score
    }
    return { solved: board.every(v => v !== '.'), score }
  }

  // ── Hint ──────────────────────────────────────────────────────────
  function getHint(
    board: CellValue[], hC: Constraint[][], vC: Constraint[][],
  ): { index: number; value: CellValue } | null {
    const force = findCheapestForce(board, hC, vC)
    if (force && force.cells.length > 0) return { index: force.cells[0].idx, value: force.cells[0].val }
    return null
  }

  // ── Helpers ───────────────────────────────────────────────────────
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

  function shuffle<T>(arr: T[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }

  // ── Generator ──────────────────────────────────────────────────────
  async function generatePuzzle(
    difficulty: Difficulty, signal: { cancelled: boolean },
  ): Promise<Puzzle | null> {
    const config = DIFFICULTY_CONFIG[difficulty]
    const minScore = config.minScore ?? 0
    const maxScore = config.maxScore ?? Infinity
    let attempts = 0

    while (true) {
      if (signal.cancelled) return null
      const solution = generateCompleteBoard()
      const { hConstraints: hC, vConstraints: vC } = config.noHints
        ? emptyConstraints()
        : placeAllConstraints(solution)

      const board = removeCells(solution, hC, vC)
      if (!config.noHints) pruneConstraints(board, hC, vC)

      const { solved, score } = solveWithScoring(board, hC, vC)
      if (solved && score >= minScore && score <= maxScore) {
        return { board, solution, hConstraints: hC, vConstraints: vC, difficulty }
      }
      if (++attempts % 3 === 0) await new Promise(r => setTimeout(r, 0))
    }
  }

  function removeCells(
    solution: CellValue[], hC: Constraint[][], vC: Constraint[][],
  ): CellValue[] {
    const board = [...solution]
    const indices = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i)
    shuffle(indices)
    for (const idx of indices) {
      const saved = board[idx]
      board[idx] = '.'
      if (!solveWithScoring([...board], hC, vC).solved) board[idx] = saved
    }
    return board
  }

  function pruneConstraints(board: CellValue[], hC: Constraint[][], vC: Constraint[][]): void {
    const edges: { type: 'h' | 'v'; r: number; c: number }[] = []
    for (let r = 0; r < GRID_SIZE; r++)
      for (let c = 0; c < GRID_SIZE - 1; c++)
        if (hC[r][c] !== '.') edges.push({ type: 'h', r, c })
    for (let r = 0; r < GRID_SIZE - 1; r++)
      for (let c = 0; c < GRID_SIZE; c++)
        if (vC[r][c] !== '.') edges.push({ type: 'v', r, c })
    shuffle(edges)

    for (const edge of edges) {
      const arr = edge.type === 'h' ? hC : vC
      const saved = arr[edge.r][edge.c]
      arr[edge.r][edge.c] = '.'
      if (!solveWithScoring([...board], hC, vC).solved) arr[edge.r][edge.c] = saved
    }
  }

  // ── Validator ──────────────────────────────────────────────────────
  // Line-force solvability guarantees a unique solution, so just compare.
  function checkWin(board: CellValue[], sol: CellValue[]): boolean {
    return board.every((v, i) => v === sol[i])
  }

  // ── Game state ─────────────────────────────────────────────────────
  let board = $state<CellValue[]>([])
  let initialBoard = $state<CellValue[]>([])
  let solution = $state<CellValue[]>([])
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

  let generationSignal: { cancelled: boolean } | null = null
  let pregenPuzzle: Puzzle | null = null
  let pregenSignal: { cancelled: boolean } | null = null

  function startPregen(d: Difficulty) {
    if (pregenSignal) pregenSignal.cancelled = true
    const signal = { cancelled: false }
    pregenSignal = signal
    generatePuzzle(d, signal).then(p => { if (p && !signal.cancelled) pregenPuzzle = p })
  }

  function applyPuzzle(puzzle: Puzzle, d: Difficulty) {
    difficulty = d
    won = false
    board = [...puzzle.board]
    initialBoard = [...puzzle.board]
    solution = [...puzzle.solution]
    hConstraints = puzzle.hConstraints
    vConstraints = puzzle.vConstraints
    moves = []
    elapsed = 0
    loading = false
    startTimer()
    startPregen(d)
  }

  async function newGame(d: Difficulty) {
    if (generationSignal) generationSignal.cancelled = true
    if (pregenSignal) pregenSignal.cancelled = true

    if (pregenPuzzle && pregenPuzzle.difficulty === d) {
      const puzzle = pregenPuzzle
      pregenPuzzle = null
      stopTimer()
      applyPuzzle(puzzle, d)
      return
    }
    pregenPuzzle = null

    const signal = { cancelled: false }
    generationSignal = signal

    loading = true
    difficulty = d
    won = false
    stopTimer()

    await new Promise(r => setTimeout(r, 20))
    const puzzle = await generatePuzzle(d, signal)
    if (!puzzle || signal.cancelled) return

    applyPuzzle(puzzle, d)
  }

  function toggleCell(index: number, forward: boolean) {
    if (won || locked[index]) return
    const prev = board[index]
    const cycle: CellValue[] = forward ? ['O', 'X', '.'] : ['.', 'X', 'O']
    const currentIdx = cycle.indexOf(prev)
    const next = cycle[(currentIdx + 1) % cycle.length]
    moves = [...moves, { index, previousValue: prev }]
    board[index] = next
    if (checkWin(board, solution)) { won = true; stopTimer() }
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

  function useHint() {
    if (won || loading) return
    let hint = getHint(board, hConstraints, vConstraints)
    if (!hint) {
      for (let i = 0; i < board.length; i++) {
        if (board[i] !== solution[i]) { hint = { index: i, value: solution[i] }; break }
      }
    }
    if (!hint) return
    moves = [...moves, { index: hint.index, previousValue: board[hint.index] }]
    board[hint.index] = hint.value
    if (checkWin(board, solution)) { won = true; stopTimer() }
  }

  async function share() {
    const size = 600
    const pad = 12
    const cellSize = (size - pad * 2) / GRID_SIZE
    const gap = 4
    const inner = cellSize - gap

    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#ddd'
    ctx.beginPath()
    ctx.roundRect(0, 0, size, size, 16)
    ctx.fill()

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const x = pad + c * cellSize + gap / 2
        const y = pad + r * cellSize + gap / 2
        const val = board[r * GRID_SIZE + c]

        ctx.fillStyle = locked[r * GRID_SIZE + c] ? '#ebe4da' : '#ffffff'
        ctx.beginPath()
        ctx.roundRect(x, y, inner, inner, 4)
        ctx.fill()

        const cx = x + inner / 2
        const cy = y + inner / 2
        const radius = inner * 0.3
        if (val === 'O') {
          ctx.fillStyle = '#ffb31e'
          ctx.beginPath()
          ctx.arc(cx, cy, radius, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = '#cb6c2f'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(cx, cy, radius, 0, Math.PI * 2)
          ctx.stroke()
        } else if (val === 'X') {
          ctx.fillStyle = '#4c8ce6'
          ctx.beginPath()
          ctx.arc(cx, cy, radius, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = '#1855aa'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(cx, cy, radius, 0, Math.PI * 2)
          ctx.stroke()
          ctx.fillStyle = locked[r * GRID_SIZE + c] ? '#ebe4da' : '#ffffff'
          ctx.beginPath()
          ctx.arc(cx + radius * 0.4, cy - radius * 0.2, radius * 0.85, 0, Math.PI * 2)
          ctx.fill()
        }

        if (c < GRID_SIZE - 1 && hConstraints[r][c] !== '.') {
          const bx = x + inner + gap / 2
          const by = cy
          ctx.fillStyle = '#eeebe7'
          ctx.beginPath()
          ctx.roundRect(bx - 9, by - 9, 18, 18, 4)
          ctx.fill()
          ctx.fillStyle = '#8c724c'
          ctx.font = 'bold 12px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(hConstraints[r][c], bx, by)
        }

        if (r < GRID_SIZE - 1 && vConstraints[r][c] !== '.') {
          const bx = cx
          const by = y + inner + gap / 2
          ctx.fillStyle = '#eeebe7'
          ctx.beginPath()
          ctx.roundRect(bx - 9, by - 9, 18, 18, 4)
          ctx.fill()
          ctx.fillStyle = '#8c724c'
          ctx.font = 'bold 12px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(vConstraints[r][c], bx, by)
        }
      }
    }

    canvas.toBlob(async (blob) => {
      if (!blob) return
      const file = new File([blob], 'tango.png', { type: 'image/png' })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try { await navigator.share({ files: [file] }) } catch {}
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'tango.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    }, 'image/png')
  }

  function handleCellClick(e: MouseEvent, i: number) {
    e.preventDefault()
    if (!locked[i]) toggleCell(i, true)
  }

  function handleCellContext(e: MouseEvent, i: number) {
    e.preventDefault()
    if (!locked[i]) toggleCell(i, false)
  }

  newGame('extreme')
</script>

<main class="min-h-svh bg-[#F8FAFD] flex flex-col items-center pt-10 pb-8 select-none">
  <div class="flex flex-col items-center gap-5 w-full max-w-[28rem] mx-auto px-4">
    <h1 class="text-3xl font-bold text-stone-800 tracking-tight">Tango</h1>

    <!-- Difficulty selector -->
    <div class="flex flex-col gap-1.5 items-center">
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-semibold text-stone-400 uppercase tracking-wider w-12 shrink-0">hints</span>
        <div class="flex gap-0.5 bg-stone-100 p-0.5 rounded-lg">
          {#each HINT_LEVELS as option}
            <button
              class="px-3 py-1 rounded-md text-xs font-medium capitalize transition-all cursor-pointer
                {difficulty === option
                  ? 'bg-white text-stone-800 shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'}"
              onclick={() => newGame(option)}
            >
              {option}
            </button>
          {/each}
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-[10px] font-semibold text-stone-400 uppercase tracking-wider w-12 shrink-0">plain</span>
        <div class="flex gap-0.5 bg-stone-100 p-0.5 rounded-lg">
          {#each NOHINT_LEVELS as option}
            <button
              class="px-3 py-1 rounded-md text-xs font-medium capitalize transition-all cursor-pointer
                {difficulty === option
                  ? 'bg-white text-stone-800 shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'}"
              onclick={() => newGame(option)}
            >
              {option.replace('-nohint', '')}
            </button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Board -->
    <div class="w-full">
      {#if loading}
        <div class="aspect-square rounded bg-[#ebe4da] outline outline-1 outline-[#ebe4da] flex items-center justify-center">
          <span class="text-stone-400 text-lg">Generating…</span>
        </div>
      {:else}
        <div class="grid grid-cols-6 rounded outline outline-1 outline-[#ebe4da] aspect-square overflow-hidden">
          {#each board as value, i}
            {@const row = Math.floor(i / GRID_SIZE)}
            {@const col = i % GRID_SIZE}
            <div class="relative border border-[#ebe4da]
              {locked[i] ? 'bg-[#eeebe7]' : 'bg-white'}
              {i === 0 ? 'rounded-tl-[3px]' : i === GRID_SIZE - 1 ? 'rounded-tr-[3px]' : i === GRID_SIZE * (GRID_SIZE - 1) ? 'rounded-bl-[3px]' : i === GRID_SIZE * GRID_SIZE - 1 ? 'rounded-br-[3px]' : ''}">
              <button
                class="aspect-square w-full flex items-center justify-center overflow-hidden
                  {locked[i] ? 'bg-[#eeebe7] cursor-default' : 'bg-white cursor-pointer'}"
                onclick={(e) => handleCellClick(e, i)}
                oncontextmenu={(e) => handleCellContext(e, i)}
              >
                {#if value === 'O'}
                  <svg class="w-1/2 h-1/2" viewBox="0 0 31 31" fill="none">
                    <path d="M29.25 15.5C29.25 23.09 23.09 29.25 15.5 29.25C7.91 29.25 1.75 23.09 1.75 15.5C1.75 7.91 7.91 1.75 15.5 1.75C23.09 1.75 29.25 7.91 29.25 15.5Z" fill="#ffb31e" stroke="#cb6c2f" stroke-width="2" />
                  </svg>
                {:else if value === 'X'}
                  <svg class="w-1/2 h-1/2" viewBox="0 0 28 28" fill="none">
                    <defs>
                      <clipPath id="moon-clip-{i}">
                        <rect x="0.0976562" y="4.26611" width="24" height="24" rx="12" transform="rotate(-10 0.0976562 4.26611)" fill="white" />
                      </clipPath>
                    </defs>
                    <g clip-path="url(#moon-clip-{i})">
                      <path d="M8.10583 19.9024C15.2282 18.6466 19.2619 11.9868 17.0757 5.09295C16.8785 4.47115 16.6376 3.86915 16.3574 3.28957C16.3507 3.27584 16.3467 3.26256 16.3446 3.24986C20.5748 4.17473 24.0337 7.5648 24.8316 12.0899C25.8865 18.0727 21.8917 23.778 15.9088 24.8329C11.4675 25.616 7.17692 23.6165 4.82974 20.0826C4.84051 20.0805 4.85231 20.0796 4.86526 20.0804C5.93904 20.1476 7.02621 20.0928 8.10583 19.9024Z" fill="#4c8ce6" stroke="#1855aa" stroke-width="2" />
                      <circle cx="12" cy="12" r="12" transform="matrix(0.984808 -0.173648 0.302281 0.953219 -11.1387 -1.87585)" fill="none" />
                    </g>
                  </svg>
                {/if}
              </button>

              {#if col < GRID_SIZE - 1 && hConstraints[row][col] !== '.'}
                <span class="absolute top-1/2 right-0 translate-x-[calc(50%+1px)] -translate-y-1/2 z-10
                  w-[30%] h-[30%] pointer-events-none flex items-center justify-center">
                  {#if hConstraints[row][col] === '='}
                    <svg class="w-full h-full" viewBox="0 0 18 18" fill="none">
                      <rect width="18" height="18" rx="4" fill="white" />
                      <path d="M14.25 11.65C14.25 12.12 13.87 12.5 13.4 12.5H4.85C4.38 12.5 4 12.12 4 11.65C4 11.18 4.38 10.79 4.85 10.79H13.4C13.87 10.79 14.25 11.18 14.25 11.65ZM14.25 6.85C14.25 7.32 13.87 7.71 13.4 7.71H4.85C4.38 7.71 4 7.32 4 6.85C4 6.38 4.38 6 4.85 6H13.4C13.87 6 14.25 6.38 14.25 6.85Z" fill="#8c724c" />
                    </svg>
                  {:else}
                    <svg class="w-full h-full" viewBox="0 0 18 18" fill="none">
                      <rect width="18" height="18" rx="4" fill="white" />
                      <path d="M13.475 5.025C13.185 4.735 12.715 4.735 12.425 5.025L10.03 7.42C9.737 7.713 9.263 7.713 8.97 7.42L6.575 5.025C6.285 4.735 5.815 4.735 5.525 5.025C5.235 5.315 5.235 5.785 5.525 6.075L7.92 8.47C8.213 8.763 8.213 9.237 7.92 9.53L5.525 11.925C5.235 12.215 5.235 12.685 5.525 12.975C5.815 13.265 6.285 13.265 6.575 12.975L8.97 10.58C9.263 10.287 9.737 10.287 10.03 10.58L12.425 12.975C12.715 13.265 13.185 13.265 13.475 12.975C13.765 12.685 13.765 12.215 13.475 11.925L11.08 9.53C10.787 9.237 10.787 8.763 11.08 8.47L13.475 6.075C13.765 5.785 13.765 5.315 13.475 5.025Z" fill="#8c724c" />
                    </svg>
                  {/if}
                </span>
              {/if}

              {#if row < GRID_SIZE - 1 && vConstraints[row][col] !== '.'}
                <span class="absolute bottom-0 left-1/2 translate-y-[calc(50%+1px)] -translate-x-1/2 z-10
                  w-[30%] h-[30%] pointer-events-none flex items-center justify-center">
                  {#if vConstraints[row][col] === '='}
                    <svg class="w-full h-full" viewBox="0 0 18 18" fill="none">
                      <rect width="18" height="18" rx="4" fill="white" />
                      <path d="M14.25 11.65C14.25 12.12 13.87 12.5 13.4 12.5H4.85C4.38 12.5 4 12.12 4 11.65C4 11.18 4.38 10.79 4.85 10.79H13.4C13.87 10.79 14.25 11.18 14.25 11.65ZM14.25 6.85C14.25 7.32 13.87 7.71 13.4 7.71H4.85C4.38 7.71 4 7.32 4 6.85C4 6.38 4.38 6 4.85 6H13.4C13.87 6 14.25 6.38 14.25 6.85Z" fill="#8c724c" />
                    </svg>
                  {:else}
                    <svg class="w-full h-full" viewBox="0 0 18 18" fill="none">
                      <rect width="18" height="18" rx="4" fill="white" />
                      <path d="M13.475 5.025C13.185 4.735 12.715 4.735 12.425 5.025L10.03 7.42C9.737 7.713 9.263 7.713 8.97 7.42L6.575 5.025C6.285 4.735 5.815 4.735 5.525 5.025C5.235 5.315 5.235 5.785 5.525 6.075L7.92 8.47C8.213 8.763 8.213 9.237 7.92 9.53L5.525 11.925C5.235 12.215 5.235 12.685 5.525 12.975C5.815 13.265 6.285 13.265 6.575 12.975L8.97 10.58C9.263 10.287 9.737 10.287 10.03 10.58L12.425 12.975C12.715 13.265 13.185 13.265 13.475 12.975C13.765 12.685 13.765 12.215 13.475 11.925L11.08 9.53C10.787 9.237 10.787 8.763 11.08 8.47L13.475 6.075C13.765 5.785 13.765 5.315 13.475 5.025Z" fill="#8c724c" />
                    </svg>
                  {/if}
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
        class="px-5 py-2 rounded-xl bg-amber-50 text-amber-700 font-medium hover:bg-amber-100 transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        onclick={useHint}
        disabled={loading || won}
      >
        Hint
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

    <!-- Timer -->
    <div class="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full text-sm font-mono text-stone-600">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      {formattedTime()}
    </div>

  </div>

  <p class="text-center text-xs text-gray-500 mt-auto pt-8">
    Inspired by Tango on LinkedIn. All rights belong to their respective owners.
  </p>

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
