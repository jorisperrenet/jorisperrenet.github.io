<script lang="ts">
  import type { Difficulty } from '../engine/types.js'

  let {
    selected,
    onselect,
  }: {
    selected: Difficulty
    onselect: (d: Difficulty) => void
  } = $props()

  const options: Difficulty[] = ['medium', 'hard', 'extreme', 'extreme+']
</script>

<div class="flex gap-1 bg-stone-100 p-1 rounded-xl">
  {#each options as option}
    <button
      class="px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all cursor-pointer
        {selected === option
          ? 'bg-white text-stone-800 shadow-sm'
          : 'text-stone-500 hover:text-stone-700'}"
      onclick={() => onselect(option)}
    >
      {option}
    </button>
  {/each}
</div>
