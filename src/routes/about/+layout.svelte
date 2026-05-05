<script lang="ts">
  const pageTitle = 'About Joris Perrenet — MSc Mathematics & Software Engineer';
  const pageDescription = 'Background, education and projects of Joris Perrenet: MSc Mathematics from Leiden University, with experience in Python, Rust and applied math.';
  const pageUrl = 'https://jorisperrenet.com/about';
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
	<meta property="og:type" content="profile" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:image" content={pageImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={pageImage} />
</svelte:head>

<div class="flex min-h-screen flex-col">
  <main class="flex-1">
    {@render children()}
  </main>

  <footer>
    <p class="text-center py-2">
      &copy {year} - Joris Perrenet
    </p>
  </footer>
</div>
