<script>
	import github from '$lib/images/github-logo.svg';
	import leetcode from '$lib/images/leetcode-logo.svg';
	import codeforces from '$lib/images/codeforces-logo.svg';
	import mathse from '$lib/images/mathse-logo.svg';
  import Header from "./Header.svelte";

  // Edit this list to add / reorder / refine projects.
  // Each entry: { name, url, description, image?, featured?, crop?, tags?, lang? }
  //   - crop: [from, to] vertical slice of the image to show, as fractions
  //           of the image's own height — aspect-ratio independent.
  //           [0, 0.5] = top half, [0.3, 0.7] = middle 40%, [0, 0.6] = top 60%.
  //           Values outside [0, 1] are allowed — anything past the source
  //           renders as empty space. Omit `crop` to show the full image.
  //   - tags: small chip labels rendered under the description.
  //   - lang: BCP-47 hint (e.g. 'nl') for hyphenation — defaults to 'en'.
  const projects = [
    {
      name: 'Pet Detective',
      url: '/pet-detective',
      description: 'Solver and solution library for Lumosity\'s Pet Detective puzzle.',
      image: '/screenshots/pet-detective.png',
      featured: true,
      crop: [0.33, 0.82],
      tags: ['Rust', 'Optimisation', 'Puzzle'],
    },
    {
      name: 'VectorMation',
      url: '/VectorMation',
      description: 'Vector-based math animation engine, an SVG-driven alternative to manim.',
      image: '/screenshots/vectormation.svg',
      tags: ['Python', 'SVG', 'Rendering'],
    },
    {
      name: 'Master Thesis',
      url: '/MasterThesis/build_latex/main.pdf',
      description: 'Decoding CSIDH: a guide to isogeny-based cryptography. Leiden University.',
      image: '/screenshots/master-thesis.png',
      tags: ['Cryptography', 'LaTeX', 'Number Theory'],
    },
    {
      name: 'Padel Scheduler',
      url: '/padel',
      description: 'Create mathematically optimal padel tournaments.',
      image: '/screenshots/padel.png',
      crop: [0, 0.5],
      tags: ['Linear Programming', 'Optimisation', 'PDF-generation'],
    },
    {
      name: 'Durak (web-version)',
      url: '/durak-online',
      description: 'In-game MCTS helper for the game of durak, using multiple threads and web-assembly.',
      image: '/screenshots/durak-online.png',
      featured: true,
      crop: [0, 0.5],
      tags: ['Rust', 'WebAssembly', 'MCTS'],
    },
    {
      name: 'Bachelor Thesis',
      url: '/BachelorThesis/Approximating_Rayleigh_Integrals_Joris_Perrenet.pdf',
      description: 'Methods for reducing error in approximations of the Rayleigh integral. TU Delft.',
      image: '/screenshots/bachelor-thesis.png',
      tags: ['Numerical Methods', 'LaTeX'],
    },
    {
      name: 'Tango',
      url: '/tango',
      description: 'Practice your skills in the LinkedIn tango game!',
      image: '/screenshots/tango.png',
      featured: true,
      tags: ['LinkedIn', 'Svelte', 'Puzzle'],
    },
    {
      name: 'Practice Math',
      url: '/practice-math',
      description: 'Tool for practicing math, currently focused on derivatives.',
      image: '/screenshots/practice-math.png',
      crop: [0, 0.38],
      tags: ['Derivatives', 'Math'],
    },
    {
      name: 'Primes in Arithmetic Pro­gres­sion',
      url: 'https://github.com/jorisperrenet/arithmetic-progression',
      description: 'GPU-accelerated search for arithmetic progressions of primes, used to break multiple records.',
      tags: ['CUDA', 'C++', 'Rust', 'Number Theory'],
    },
    {
      name: 'Iscripts',
      url: 'https://github.com/jorisperrenet/iscripts/blob/master/INSTALL.md',
      description: 'Installation scripts and a detailed setup guide for my Arch Linux configuration.',
      tags: ['Bash', 'Arch Linux'],
    },
    {
      name: 'Durak (terminal-version)',
      url: 'https://github.com/jorisperrenet/durak',
      description: 'Play the card game durak against a Monte Carlo Tree Search AI, written in Python and Rust.',
      tags: ['Python', 'Rust', 'MCTS'],
    },
    {
      name: 'Diag­nos­tic Questions (NL)',
      url: '/diagnostische-vragen',
      description: 'Curated academic references on diagnostic questions in education (Dutch).',
      lang: 'nl',
      tags: ['Svelte', 'Education'],
    },
  ];

  function isExternal(url) {
    return /^https?:\/\//.test(url);
  }

  // crop: [from, to] as fractions of the source's own height — aspect-ratio
  // independent. The image is translated by -from*100% of its own height,
  // and the surrounding wrapper's height is set to range * (image's rendered
  // height) by the imageCrop action below, so source y=from lines up with
  // the top of the window. Values outside [0, 1] are allowed — anything
  // past the source renders as empty space (background colour).
  function cropStyle(crop) {
    if (!Array.isArray(crop) || crop.length < 2) return null;
    const from = Number(crop[0]);
    const to = Number(crop[1]);
    if (!Number.isFinite(from) || !Number.isFinite(to)) return null;
    const range = to - from;
    if (range <= 0) return null;
    return {
      range,
      translateY: `${(-from * 100).toFixed(2)}%`,
    };
  }

  // Action: keeps the wrapper's height in sync with range * image.offsetHeight
  // so the visible window scales with the image's rendered size.
  function imageCrop(node, params) {
    let { range } = params;
    const apply = () => {
      const h = node.offsetHeight;
      if (h > 0 && node.parentElement) {
        node.parentElement.style.height = `${range * h}px`;
      }
    };
    const ro = new ResizeObserver(apply);
    ro.observe(node);
    node.addEventListener('load', apply);
    apply();
    return {
      update(next) { range = next.range; apply(); },
      destroy() {
        ro.disconnect();
        node.removeEventListener('load', apply);
      },
    };
  }
</script>

<svelte:head>
	<title>About Joris Perrenet — MSc Mathematics & Software Engineer</title>
</svelte:head>

<Header/>
<div class="w-full max-w-xl mx-auto px-4 mt-6 mb-4 text-sm">
    <p class="py-2">
        Hi there! I'm Joris, based in the Netherlands. I tinker with software projects,
        climb at the bouldering gym, and can juggle 5 balls (after much practice).
    </p>

    <p class="py-2">
        I recently completed my MSc Mathematics at Leiden University with a thesis on isogeny-based cryptography
        <a class="text-blue-600 dark:text-blue-400 hover:underline" href="/MasterThesis/build_latex/main.pdf"><em>Decoding CSIDH</em></a>. I build performance-focused
        tools in Rust and Python &mdash; including a
        <a class="text-blue-600 dark:text-blue-400 hover:underline" href="https://github.com/jorisperrenet/arithmetic-progression">GPU-accelerated search</a> for arithmetic progressions of primes
        (which broke several <a class="text-blue-600 dark:text-blue-400 hover:underline" href="https://www.pzktupel.de/PAP/aprecords.php#minimalend">records</a>), an
        <a class="text-blue-600 dark:text-blue-400 hover:underline" href="/durak-online">MCTS helper</a> for the card game durak
        running multi-threaded in the browser via WebAssembly, and a
        <a class="text-blue-600 dark:text-blue-400 hover:underline" href="/padel">tournament planner</a> for padel using linear programming for optimal scheduling.
    </p>
</div>

<div class="mx-auto w-full max-w-2xl px-6 mb-2">
    <div class="mb-4 text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Visit me on</p>
    </div>
    <div class="flex flex-row flex-wrap items-center justify-center gap-3">
        <a href="https://github.com/jorisperrenet" target="_blank" rel="noopener" aria-label="GitHub"
           class="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gradient-to-b from-white to-gray-100 shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm dark:border-transparent dark:from-gray-100 dark:to-gray-300 dark:shadow-none dark:ring-1 dark:ring-white/10 dark:hover:ring-white/30">
            <img class="h-7 w-7" src={github} alt="" />
        </a>
        <a href="https://leetcode.com/JorisPerrenet/" target="_blank" rel="noopener" aria-label="LeetCode"
           class="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gradient-to-b from-white to-gray-100 shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm dark:border-transparent dark:from-gray-100 dark:to-gray-300 dark:shadow-none dark:ring-1 dark:ring-white/10 dark:hover:ring-white/30">
            <img class="h-7 w-7" src={leetcode} alt="" />
        </a>
        <a href="https://codeforces.com/profile/Joris_Perrenet" target="_blank" rel="noopener" aria-label="CodeForces"
           class="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gradient-to-b from-white to-gray-100 shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm dark:border-transparent dark:from-gray-100 dark:to-gray-300 dark:shadow-none dark:ring-1 dark:ring-white/10 dark:hover:ring-white/30">
            <img class="h-7 w-7" src={codeforces} alt="" />
        </a>
        <a href="https://math.stackexchange.com/users/1049661/jorisperrenet" target="_blank" rel="noopener" aria-label="MathSE"
           class="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gradient-to-b from-white to-gray-100 shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm dark:border-transparent dark:from-gray-100 dark:to-gray-300 dark:shadow-none dark:ring-1 dark:ring-white/10 dark:hover:ring-white/30">
            <img class="h-7 w-7" src={mathse} alt="" />
        </a>
        <a href="https://projecteuler.net/about" target="_blank" rel="noopener" aria-label="Project Euler stats"
           class="inline-flex items-center overflow-hidden border border-gray-200 bg-gradient-to-b from-white to-gray-100 shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm dark:border-transparent dark:from-gray-100 dark:to-gray-300 dark:shadow-none dark:ring-1 dark:ring-white/10 dark:hover:ring-white/30">
            <img class="block h-12 w-auto" src="https://projecteuler.net/profile/Joris_Perrenet.png" alt="" />
        </a>
    </div>
</div>

<div id="projects" class="w-full max-w-3xl mx-auto px-4 my-5">
    <div class="mb-4 text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Selected work</p>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {#each projects as p}
            <a
                href={p.url}
                target={isExternal(p.url) ? '_blank' : null}
                rel={isExternal(p.url) ? 'noopener' : null}
                class="group flex flex-col overflow-hidden rounded-xl border-2 border border-gray-200 bg-white no-underline shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-400 dark:shadow-none dark:hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)] {p.featured ? 'lg:col-span-2' : ''}"
            >
                {#if p.image}
                    {@const cs = cropStyle(p.crop)}
                    {#if cs}
                        <div class="w-full overflow-hidden border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40">
                            <img
                                src={p.image}
                                alt=""
                                use:imageCrop={{ range: cs.range }}
                                style="--ty: {cs.translateY};"
                                class="block w-full translate-y-[var(--ty)] transition-transform duration-300 group-hover:scale-[1.04]"
                                loading="lazy"
                                onerror={(e) => (e.currentTarget.parentElement.style.display = 'none')}
                            />
                        </div>
                    {:else}
                        <div class="w-full overflow-hidden border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40 {p.featured ? 'aspect-video' : 'aspect-square'}">
                            <img
                                src={p.image}
                                alt=""
                                class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                                loading="lazy"
                                onerror={(e) => (e.currentTarget.parentElement.style.display = 'none')}
                            />
                        </div>
                    {/if}
                {/if}
                <div class="flex flex-1 flex-col p-3 {p.image ? '' : 'p-2'}">
                    <div class="flex items-start justify-between gap-1">
                        <h3 lang={p.lang ?? 'en'}
                            class="min-w-0 hyphens-auto font-bold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400 text-base [overflow-wrap:break-word]">
                            {p.name}
                        </h3>
                        {#if !p.image}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="mt-1 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-500 dark:group-hover:text-blue-400" aria-hidden="true">
                                <path d="M7 17L17 7" />
                                <path d="M7 7h10v10" />
                            </svg>
                        {/if}
                    </div>
                    <p class="mt-1.5 leading-relaxed text-gray-600 dark:text-gray-300 text-xs">
                        {p.description}
                    </p>
                    {#if p.tags?.length}
                        <div class="mt-auto flex flex-wrap gap-1 pt-2">
                            {#each p.tags as tag}
                                <span class="rounded bg-gray-200 px-1.5 py-1.5 text-[9px] font-medium leading-none text-gray-600 dark:bg-gray-700/60 dark:text-gray-300">
                                    {tag}
                                </span>
                            {/each}
                        </div>
                    {/if}
                </div>
            </a>
        {/each}
    </div>
</div>
