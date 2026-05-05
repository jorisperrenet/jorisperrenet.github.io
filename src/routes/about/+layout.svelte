<script lang="ts">
  const pageTitle = 'About Joris Perrenet — MSc Mathematics & Software Engineer';
  const pageDescription = 'Joris Perrenet — MSc Mathematics from Leiden University (Decoding CSIDH), BSc Applied Mathematics from TU Delft. Software engineer building tools in Rust and Python: GPU-accelerated record-breaking prime search, browser MCTS engines, mathematical animation libraries, optimisation-based tournament planners.';
  const pageUrl = 'https://jorisperrenet.com/about';
  const pageImage = 'https://jorisperrenet.com/profile.jpg';

  import "../../app.css";
  let now = new Date();
  let year = now.getFullYear();

  let { children } = $props();

  // Single @graph so Google parses the whole page as one connected entity:
  // - ProfilePage wraps the Person (Google's recommended structure for an
  //   /about page about one individual)
  // - Person has every signal we can give it (alma maters, skills, socials)
  // - BreadcrumbList renders breadcrumbs in SERP
  // - ItemList exposes the 12 projects so Google associates them with the Person
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': 'https://jorisperrenet.com/about#profilepage',
        url: pageUrl,
        name: pageTitle,
        description: pageDescription,
        inLanguage: 'en',
        primaryImageOfPage: pageImage,
        mainEntity: { '@id': 'https://jorisperrenet.com/#person' },
        breadcrumb: { '@id': 'https://jorisperrenet.com/about#breadcrumbs' },
        hasPart: { '@id': 'https://jorisperrenet.com/about#projects' },
      },
      {
        '@type': 'Person',
        '@id': 'https://jorisperrenet.com/#person',
        name: 'Joris Perrenet',
        alternateName: 'L.J. Perrenet',
        givenName: 'Joris',
        familyName: 'Perrenet',
        url: 'https://jorisperrenet.com/',
        image: {
          '@type': 'ImageObject',
          url: pageImage,
          width: 448,
          height: 448,
        },
        jobTitle: 'Software Engineer',
        description: 'MSc Mathematics from Leiden University (thesis on isogeny-based cryptography, Decoding CSIDH). Software engineer with deep experience in Rust, Python, and applied mathematics — building performance-focused tools for cryptography, optimisation, numerical methods, and mathematical visualisation.',
        nationality: { '@type': 'Country', name: 'Netherlands' },
        knowsLanguage: ['en', 'nl'],
        alumniOf: [
          {
            '@type': 'CollegeOrUniversity',
            name: 'Leiden University',
            department: 'Mathematical Institute',
            sameAs: 'https://www.universiteitleiden.nl/en/science/mathematics',
          },
          {
            '@type': 'CollegeOrUniversity',
            name: 'Delft University of Technology',
            department: 'Applied Mathematics',
            sameAs: 'https://www.tudelft.nl/en/eemcs/the-faculty/departments/applied-mathematics',
          },
        ],
        knowsAbout: [
          'Mathematics',
          'Software engineering',
          'Cryptography',
          'Isogeny-based cryptography',
          'CSIDH',
          'Post-quantum cryptography',
          'Elliptic curves',
          'Number theory',
          'Numerical methods',
          'Linear programming',
          'Monte Carlo Tree Search',
          'WebAssembly',
          'Rust',
          'Python',
          'C++',
          'CUDA',
          'Svelte',
          'Algorithms',
          'Competitive programming',
        ],
        sameAs: [
          'https://github.com/jorisperrenet',
          'https://www.linkedin.com/in/jorisperrenet/',
          'https://leetcode.com/JorisPerrenet/',
          'https://codeforces.com/profile/Joris_Perrenet',
          'https://math.stackexchange.com/users/1049661/jorisperrenet',
          'https://projecteuler.net/profile/Joris_Perrenet.png',
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://jorisperrenet.com/about#breadcrumbs',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Joris Perrenet', item: 'https://jorisperrenet.com/' },
          { '@type': 'ListItem', position: 2, name: 'About' },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': 'https://jorisperrenet.com/about#projects',
        name: 'Selected work by Joris Perrenet',
        numberOfItems: 12,
        itemListElement: [
          { '@type': 'ListItem', position: 1,  name: 'Pet Detective Solver',          url: 'https://jorisperrenet.com/pet-detective/' },
          { '@type': 'ListItem', position: 2,  name: 'VectorMation',                  url: 'https://jorisperrenet.com/VectorMation/' },
          { '@type': 'ListItem', position: 3,  name: 'Decoding CSIDH (Master thesis)',url: 'https://jorisperrenet.com/MasterThesis/' },
          { '@type': 'ListItem', position: 4,  name: 'Padel Schedule Generator',      url: 'https://jorisperrenet.com/padel' },
          { '@type': 'ListItem', position: 5,  name: 'Durak Online (MCTS, WebAssembly)', url: 'https://jorisperrenet.com/durak-online/' },
          { '@type': 'ListItem', position: 6,  name: 'Approximating Rayleigh Integrals (Bachelor thesis)', url: 'https://jorisperrenet.com/BachelorThesis/' },
          { '@type': 'ListItem', position: 7,  name: 'Tango Puzzle',                  url: 'https://jorisperrenet.com/tango' },
          { '@type': 'ListItem', position: 8,  name: 'Practice Math',                 url: 'https://jorisperrenet.com/practice-math/' },
          { '@type': 'ListItem', position: 9,  name: 'Primes in Arithmetic Progression (GPU)', url: 'https://github.com/jorisperrenet/arithmetic-progression' },
          { '@type': 'ListItem', position: 10, name: 'Iscripts (Arch Linux setup)',   url: 'https://github.com/jorisperrenet/iscripts/blob/master/INSTALL.md' },
          { '@type': 'ListItem', position: 11, name: 'Durak (terminal version, MCTS)',url: 'https://github.com/jorisperrenet/durak' },
          { '@type': 'ListItem', position: 12, name: 'Diagnostische Vragen (NL)',     url: 'https://jorisperrenet.com/diagnostische-vragen' },
        ],
      },
    ],
  };
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta name="author" content="Joris Perrenet" />
	<meta name="keywords" content="Joris Perrenet, MSc Mathematics, Leiden University, TU Delft, software engineer, Rust, Python, CSIDH, isogeny-based cryptography, post-quantum cryptography, WebAssembly, MCTS, numerical methods, applied mathematics" />
	<link rel="canonical" href={pageUrl} />
	<meta name="theme-color" content="#fff" />
	<meta property="og:type" content="profile" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:image" content={pageImage} />
	<meta property="og:image:width" content="448" />
	<meta property="og:image:height" content="448" />
	<meta property="profile:first_name" content="Joris" />
	<meta property="profile:last_name" content="Perrenet" />
	<meta property="profile:username" content="jorisperrenet" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={pageImage} />
	{@html `<script type="application/ld+json">${JSON.stringify(graph)}<\/script>`}
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
