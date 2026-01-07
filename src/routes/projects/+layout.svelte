<script lang="ts">
  const pageTitle = 'Joris Perrenet';
  const pageDescription = 'My personal website!';

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

<div class="flex h-screen flex-col">
  <main class="flex-1">
    {@render children()}
  </main>

  <footer>
    <p class="text-center py-2">
      &copy {year} - Joris Perrenet
    </p>
  </footer>
</div>
