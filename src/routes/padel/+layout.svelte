<script lang="ts">
  const pageTitle = 'Padel Schedule Generator — Joris Perrenet';
  const pageDescription = 'Free padel round-robin schedule generator: enter players, courts and rounds to get a balanced rotation that maximises unique partner and opponent pairings.';
  const pageUrl = 'https://jorisperrenet.com/padel';
  const pageImage = 'https://jorisperrenet.com/profile.jpg';

  import "../../app.css";
  let now = new Date();
  let year = now.getFullYear();

  let { children } = $props();
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={pageUrl} />
	<meta name="theme-color" content="#121519" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:image" content={pageImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={pageImage} />
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
