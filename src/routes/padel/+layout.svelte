<script lang="ts">
  const pageTitle = 'Padel Schedule Generator — Joris Perrenet';
  const pageDescription = 'Free padel round-robin schedule generator: enter players, courts and rounds to get a balanced rotation that maximises unique partner and opponent pairings.';
  const pageUrl = 'https://jorisperrenet.com/padel';
  const pageImage = 'https://jorisperrenet.com/profile.jpg';

  import "../../app.css";
  import SiteHeader from '$lib/site-kit/SiteHeader.svelte';
  import SiteFooter from '$lib/site-kit/SiteFooter.svelte';

  let { children } = $props();
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={pageUrl} />
	<meta name="theme-color" content="#f9fbff" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#111827" media="(prefers-color-scheme: dark)" />
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

<div class="flex min-h-screen flex-col bg-[#f9fbff] text-gray-900 dark:bg-[#111827] dark:text-gray-100">
  <SiteHeader projectName="Padel Scheduler" projectHref="/padel" localNavigation brandLogo />
  <main class="flex-1">
    {@render children()}
  </main>

  <SiteFooter projectName="Padel Scheduler" sourceHref="https://github.com/jorisperrenet/jorisperrenet.github.io" localNavigation />
</div>
