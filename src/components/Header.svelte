<script>
	import ThemeToggle from './ThemeToggle.svelte';
	import { page } from '$app/state';

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/about', label: 'About' },
		{ href: '/blog', label: 'Blog' },
	];

	function isActive(href) {
		const path = page.url.pathname;
		if (href === '/') return path === '/';
		return path === href || path.startsWith(href + '/');
	}
</script>

<header class="sticky top-0 z-30 w-full border-b border-gray-200 bg-[#fcfeff]/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-800/70">
	<div class="relative">
		<div class="flex w-full items-center justify-start pl-4 pr-14 min-[480px]:justify-center min-[480px]:pr-4 py-1">
			<nav>
				<ul class="m-0 flex items-center gap-1 p-0">
					{#each navLinks as link}
						<li>
							<a
								href={link.href}
								aria-current={isActive(link.href) ? 'page' : undefined}
								class="block border-b-2 px-3 py-1.5 text-sm font-bold uppercase tracking-wider transition-colors {isActive(link.href)
									? 'border-blue-500 text-black dark:border-blue-400 dark:text-white'
									: 'border-transparent text-gray-700 hover:text-black dark:text-gray-200 dark:hover:text-white'}"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
		<div class="absolute right-4 top-1/2 -translate-y-1/2">
			<ThemeToggle />
		</div>
	</div>
</header>
