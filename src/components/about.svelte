<script>
	import github from '$lib/images/github-logo.svg';
	import leetcode from '$lib/images/leetcode-logo.svg';
	import codeforces from '$lib/images/codeforces-logo.svg';
	import mathse from '$lib/images/mathse-logo.svg';
  import Header from "./Header.svelte";
</script>

<svelte:head>
	<title>About Joris Perrenet — MSc Mathematics & Software Engineer</title>
</svelte:head>

<Header/>
<header class="mx-auto max-w-xl px-4 pt-10 text-center sm:pt-14">
    <h1 class="text-4xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-5xl">About</h1>
</header>
<div class="w-full max-w-xl mx-auto px-4 mt-5 mb-4 text-sm">
    <p class="py-2">
        Hi there! I'm Joris, based in the Netherlands. I tinker with software projects,
        climb at the bouldering gym, and can juggle 5 balls (after much practice).
    </p>

    <p class="py-2">
        I recently completed my MSc Mathematics at Leiden University with a thesis on isogeny-based cryptography
        <a class="text-blue-600 dark:text-blue-400 hover:underline" href="/MasterThesis/"><em>Decoding CSIDH</em></a>. I build performance-focused
        tools in Rust and Python &mdash; including a
        <a class="text-blue-600 dark:text-blue-400 hover:underline" href="https://github.com/jorisperrenet/arithmetic-progression">GPU-accelerated search</a> for arithmetic progressions of primes
        (which broke several <a class="text-blue-600 dark:text-blue-400 hover:underline" href="https://www.pzktupel.de/PAP/aprecords.php#minimalend">records</a>), an
        <a class="text-blue-600 dark:text-blue-400 hover:underline" href="/durak-online">MCTS helper</a> for the card game durak
        running multi-threaded in the browser via WebAssembly, and a
        <a class="text-blue-600 dark:text-blue-400 hover:underline" href="/padel/">tournament planner</a> for padel using linear programming for optimal scheduling.
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
