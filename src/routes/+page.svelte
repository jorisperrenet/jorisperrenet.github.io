<script lang="ts">
  import StartPage from '../components/main.svelte';

  import "../app.css";
  let now = new Date();
  let year = now.getFullYear();
</script>

<svelte:head>
	<meta name="theme-color" content="#fff" />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="flex min-h-screen flex-col">
  <main class="flex w-full flex-1 flex-col">
    <StartPage />
  </main>

  <footer>
    <p class="text-center py-2">
      &copy {year} - Joris Perrenet
    </p>
  </footer>
</div>
