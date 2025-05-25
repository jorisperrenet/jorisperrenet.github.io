<script>
  import "../app.postcss";
  import Header from "./Header.svelte";
</script>

<div class="flex flex-col min-h-screen bg-gray-100">
  <Header />

  <main class="flex flex-col flex-1">
    <slot />
  </main>

  <footer>
    <p class="text-center py-2">
      &copy 2025 - Joris Perrenet
    </p>
  </footer>
</div>
