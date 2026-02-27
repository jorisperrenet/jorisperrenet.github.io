<script lang="ts">
  import { gameState } from '../state/game.svelte.js'
  import Board from './Board.svelte'
  import Timer from './Timer.svelte'
  import WinModal from './WinModal.svelte'
  import DifficultySelector from './DifficultySelector.svelte'
</script>

<div class="flex flex-col items-center gap-5 w-full max-w-sm mx-auto px-4">
  <h1 class="text-3xl font-bold text-stone-800 tracking-tight">Tango</h1>

  <div class="flex items-center gap-4 w-full justify-between">
    <DifficultySelector
      selected={gameState.difficulty}
      onselect={(d) => gameState.newGame(d)}
    />
    <Timer time={gameState.formattedTime} />
  </div>

  <div class="w-full">
    <Board
      board={gameState.board}
      locked={gameState.locked}
      hConstraints={gameState.hConstraints}
      vConstraints={gameState.vConstraints}
      ontoggle={(i, forward) => gameState.toggleCell(i, forward)}
    />
  </div>

  <div class="flex gap-3">
    <button
      class="px-5 py-2 rounded-xl bg-stone-100 text-stone-700 font-medium hover:bg-stone-200 transition-colors
        disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      onclick={() => gameState.undo()}
      disabled={gameState.moves.length === 0}
    >
      Undo
    </button>
    <button
      class="px-5 py-2 rounded-xl bg-stone-100 text-stone-700 font-medium hover:bg-stone-200 transition-colors cursor-pointer"
      onclick={() => gameState.clear()}
    >
      Clear
    </button>
  </div>
</div>

{#if gameState.won}
  <WinModal
    time={gameState.formattedTime}
    onplayagain={() => gameState.newGame(gameState.difficulty)}
  />
{/if}
