<!-- Canonical source; copied into consuming repositories by scripts/sync.mjs. -->
<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import type { SiteSection } from './types';

	let {
		active = 'project',
		projectName = '',
		projectHref = '',
		localNavigation = false,
		brandLogo = false
	}: {
		active?: SiteSection;
		projectName?: string;
		projectHref?: string;
		localNavigation?: boolean;
		brandLogo?: boolean;
	} = $props();

	const links = $derived<Array<{ href: string; label: string; section: SiteSection }>>([
		{ href: localNavigation ? '/' : 'https://jorisperrenet.com/', label: 'Home', section: 'home' },
		{
			href: localNavigation ? '/about' : 'https://jorisperrenet.com/about',
			label: 'About',
			section: 'about'
		},
		{
			href: localNavigation ? '/blog' : 'https://jorisperrenet.com/blog/',
			label: 'Blog',
			section: 'blog'
		}
	]);

</script>

<header class="sticky top-0 z-30 w-full border-b border-gray-200 bg-[#fcfeff]/90 text-gray-900 shadow-sm shadow-gray-950/5 backdrop-blur-md dark:border-gray-800 dark:bg-gray-800/90 dark:text-gray-100">
	<div class="relative flex w-full items-center justify-center py-1 pl-4 pr-14 min-[480px]:pr-4">
		{#if brandLogo}
			<a href={localNavigation ? '/' : 'https://jorisperrenet.com/'} aria-label="Home" class="absolute left-3 inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 sm:left-4">
				<img src="/personal-logo.svg" alt="" width="690" height="750" class="h-7 w-7 object-contain dark:invert" />
			</a>
		{:else if projectName}
			<a href={projectHref || undefined} class="absolute left-4 hidden max-w-[24vw] truncate text-sm font-semibold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 lg:block">
				Joris Perrenet / {projectName}
			</a>
		{/if}
		<nav aria-label="Main navigation">
			<ul class="m-0 flex items-center gap-0.5 p-0">
				{#each links as link}
					{#if !(brandLogo && link.section === 'home')}
						<li>
						<a
							href={link.href}
							rel={localNavigation ? undefined : 'external'}
							aria-current={active === link.section ? 'page' : undefined}
							class="block border-b-2 px-3 py-1.5 text-sm font-bold uppercase tracking-wider transition-colors {active === link.section
								? 'border-blue-500 text-black dark:border-blue-400 dark:text-white'
								: 'border-transparent text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white'}"
						>{link.label}</a>
						</li>
					{/if}
				{/each}
			</ul>
		</nav>
		<div class="absolute right-4 top-1/2 -translate-y-1/2"><ThemeToggle /></div>
	</div>
</header>
