<script lang="ts">
  import type { CellValue, Constraint } from '../engine/types.js'

  let {
    value,
    locked = false,
    rightConstraint = '.' as Constraint,
    bottomConstraint = '.' as Constraint,
    onclick,
    onrightclick,
  }: {
    value: CellValue
    locked?: boolean
    rightConstraint?: Constraint
    bottomConstraint?: Constraint
    onclick?: () => void
    onrightclick?: () => void
  } = $props()

  function handleClick(e: MouseEvent) {
    e.preventDefault()
    if (locked) return
    onclick?.()
  }

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault()
    if (locked) return
    onrightclick?.()
  }
</script>

<div class="relative">
  <button
    class="aspect-square w-full flex items-center justify-center rounded-sm transition-colors
      {locked ? 'bg-stone-100 cursor-default' : 'bg-white cursor-pointer hover:bg-stone-50 active:bg-stone-100'}"
    onclick={handleClick}
    oncontextmenu={handleContextMenu}
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

  {#if rightConstraint !== '.'}
    <span class="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-10
      text-[10px] font-bold text-stone-500 bg-stone-200 rounded-full w-4 h-4
      flex items-center justify-center pointer-events-none leading-none">
      {rightConstraint}
    </span>
  {/if}

  {#if bottomConstraint !== '.'}
    <span class="absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 z-10
      text-[10px] font-bold text-stone-500 bg-stone-200 rounded-full w-4 h-4
      flex items-center justify-center pointer-events-none leading-none">
      {bottomConstraint}
    </span>
  {/if}
</div>
