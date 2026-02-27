<script lang="ts">
  import type { CellValue, Constraint } from '../engine/types.js'
  import { GRID_SIZE } from '../engine/types.js'
  import Cell from './Cell.svelte'

  let {
    board,
    locked,
    hConstraints,
    vConstraints,
    ontoggle,
  }: {
    board: CellValue[]
    locked: boolean[]
    hConstraints: Constraint[][]
    vConstraints: Constraint[][]
    ontoggle?: (index: number, forward: boolean) => void
  } = $props()
</script>

<div class="grid grid-cols-6 gap-1 bg-stone-200 p-1 rounded-xl aspect-square">
  {#each board as value, i}
    {@const row = Math.floor(i / GRID_SIZE)}
    {@const col = i % GRID_SIZE}
    <Cell
      {value}
      locked={locked[i]}
      rightConstraint={col < GRID_SIZE - 1 ? hConstraints[row][col] : '.'}
      bottomConstraint={row < GRID_SIZE - 1 ? vConstraints[row][col] : '.'}
      onclick={() => ontoggle?.(i, true)}
      onrightclick={() => ontoggle?.(i, false)}
    />
  {/each}
</div>
