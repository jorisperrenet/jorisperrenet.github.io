<script lang="ts">
  const pageTitle = 'Diagnostische vragen in het onderwijs — Joris Perrenet';
  const pageDescription = 'Een overzicht van het belang en de inzet van diagnostische vragen in de les, met onderzoek en bronnen over formatief handelen.';
  const pageUrl = 'https://jorisperrenet.com/diagnostische-vragen';
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
	<meta name="theme-color" content="#fff" />
	<meta property="og:type" content="article" />
	<meta property="og:locale" content="nl_NL" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:image" content={pageImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={pageImage} />
</svelte:head>

<div class="flex h-screen flex-col" lang="nl">
  <main class="flex-1">
    {@render children()}
  </main>

  <footer>
    <p class="text-center py-2">
      &copy {year} - Joris Perrenet
    </p>
  </footer>
</div>
