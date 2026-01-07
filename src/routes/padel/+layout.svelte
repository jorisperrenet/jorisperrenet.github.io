<script lang="ts">
  const pageTitle = 'Padel';
  const pageDescription = 'Create Padel Schedule!';

  import "../../app.css";
  let now = new Date();
  let year = now.getFullYear();

  let { children } = $props();
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta name="theme-color" content="#fff" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
</svelte:head>

<div class="flex h-screen flex-col" style="background-color: #121519; color: #000000">
  <main class="flex-1">
    {@render children()}
  </main>

  <footer>
    <p class="text-center py-2" style="background-color: #121519; color: #ebedf0">
      &copy {year} - Joris Perrenet
    </p>
  </footer>
</div>

<style>
  :global(html, body) {
      background-color: #121519;
      color: #000000;
  }
</style>
