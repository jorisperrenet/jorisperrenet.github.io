<script>
  import Header from '../../components/Header.svelte';
  import SelectedWork from '../../components/SelectedWork.svelte';
  import SiteFooter from '$lib/site-kit/SiteFooter.svelte';
  import { projectCards } from '$lib/projectCards.js';
  import '../../app.css';

  const title = 'Projects by Joris Perrenet — Mathematics, Software and Puzzles';
  const description = 'Selected projects by Joris Perrenet spanning mathematical software, cryptography, optimisation, numerical methods, WebAssembly and puzzle solvers.';
  const canonical = 'https://jorisperrenet.com/projects/';
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Selected projects by Joris Perrenet',
    numberOfItems: projectCards.length,
    itemListElement: projectCards.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: project.name.replace(/\u00ad/g, ''),
      url: project.url.startsWith('http') ? project.url : `https://jorisperrenet.com${project.url}`
    }))
  };
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content="https://jorisperrenet.com/profile.jpg" />
  <meta property="og:image:width" content="597" />
  <meta property="og:image:height" content="600" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content="https://jorisperrenet.com/profile.jpg" />
  {@html `<script type="application/ld+json">${JSON.stringify(itemList).replace(/</g, '\\u003c')}</script>`}
</svelte:head>

<div class="flex min-h-screen flex-col">
  <Header />
  <main class="flex-1 pb-10">
    <header class="mx-auto max-w-3xl px-4 pb-2 pt-10 text-center sm:pt-14">
      <h1 class="text-4xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-5xl">Projects</h1>
      <p class="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300">Mathematical software, research, optimisation tools and puzzle solvers—built to make difficult problems understandable and useful.</p>
    </header>
    <SelectedWork labelled={false} />
  </main>
  <SiteFooter localNavigation />
</div>
