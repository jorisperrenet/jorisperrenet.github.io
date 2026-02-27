<script lang="ts">
  let { time }: { time: string } = $props()
</script>

<div class="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full text-sm font-mono text-stone-600">
  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
  {time}
</div>
