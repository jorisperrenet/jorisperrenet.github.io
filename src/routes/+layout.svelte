<script>
  import "../app.postcss";
  import Header from "./Header.svelte";
  let now = new Date();
  let year = now.getFullYear();
</script>

<div class="flex flex-col min-h-screen bg-gray-100">
  <Header />

  <main class="flex flex-col flex-1">
    <slot />
  </main>

  <footer>
    <p class="text-center py-2">
      &copy {year} - Joris Perrenet
    </p>
  </footer>
</div>
