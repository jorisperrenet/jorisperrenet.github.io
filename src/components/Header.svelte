<script lang="ts">
	import { page } from '$app/state';
	import SiteHeader from '$lib/site-kit/SiteHeader.svelte';

	const active = $derived(
		page.url.pathname === '/' ? 'home' : page.url.pathname.startsWith('/about') ? 'about' : page.url.pathname.startsWith('/blog') ? 'blog' : 'project'
	);
</script>

<SiteHeader {active} localNavigation brandLogo />
