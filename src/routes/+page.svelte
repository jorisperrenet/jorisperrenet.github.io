<script lang="ts">
  import StartPage from '../components/main.svelte';
  import SiteFooter from '$lib/site-kit/SiteFooter.svelte';

  import "../app.css";
</script>

<svelte:head>
	<meta name="theme-color" content="#f9fbff" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#111827" media="(prefers-color-scheme: dark)" />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="flex min-h-screen flex-col">
  <main class="flex w-full flex-1 flex-col">
    <StartPage />
  </main>

  <SiteFooter localNavigation />
</div>
