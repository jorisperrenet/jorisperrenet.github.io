<script lang="ts">
  let {
    time,
    onplayagain,
  }: {
    time: string
    onplayagain: () => void
  } = $props()

  async function share() {
    const text = `I completed a Tango puzzle in ${time}!`
    if (navigator.share) {
      try {
        await navigator.share({ text })
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(text)
    }
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
  <div class="bg-white rounded-2xl shadow-xl p-8 mx-4 max-w-sm w-full text-center space-y-5">
    <h2 class="text-2xl font-bold text-stone-800">Puzzle Complete!</h2>
    <p class="text-stone-500">Solved in <span class="font-mono font-semibold text-stone-700">{time}</span></p>

    <div class="flex gap-3 justify-center">
      <button
        class="px-5 py-2.5 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors cursor-pointer"
        onclick={share}
      >
        Share
      </button>
      <button
        class="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-medium hover:bg-stone-200 transition-colors cursor-pointer"
        onclick={onplayagain}
      >
        Play Again
      </button>
    </div>
  </div>
</div>
