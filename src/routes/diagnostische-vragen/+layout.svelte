<script lang="ts">
  const pageTitle = 'Diagnostische vragen in het onderwijs — Joris Perrenet';
  const pageDescription = 'Een overzicht van het belang en de inzet van diagnostische vragen in de les, met onderzoek en bronnen over formatief handelen.';
  const pageUrl = 'https://jorisperrenet.com/diagnostische-vragen';

  import "../../app.css";
  import SiteHeader from '$lib/site-kit/SiteHeader.svelte';
  import SiteFooter from '$lib/site-kit/SiteFooter.svelte';

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
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
</svelte:head>

<div class="flex min-h-screen flex-col" lang="nl">
  <SiteHeader projectName="Diagnostische vragen" projectHref="/diagnostische-vragen" localNavigation brandLogo />
  <main class="flex-1">
    {@render children()}
  </main>

  <SiteFooter localNavigation />
</div>
