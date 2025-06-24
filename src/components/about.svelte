<script>
  import Header from "./Header.svelte";
</script>

<svelte:head>
	<title>About Joris</title>
</svelte:head>

<Header/>
<div class="text-justify w-full max-w-3xl mx-auto px-10 my-10 text-lg">
	<p class="py-5">
        Hi, thanks for visiting my website!
	</p>

	<p>
        My name is Joris and I'm a Dutch master's student of Mathematics at Leiden University.
        In my free time I often
        <a class="text-blue-600 hover:underline" href="/projects">program competitively</a>
        or fiddle with
        <a class="text-blue-600 hover:underline" href="/projects">other programming projects</a>
        (both mainly in
        <a class="text-blue-600 hover:underline" href="https://www.python.org/">Python</a>).
        I'm currently an active climber in my local bouldering gym and I can (after much practice) juggle 5 balls.
	</p>

    <p class="py-5">
        Feel free to contact me at
        <a href="mailto:joris.perrenet+website@gmail.com">
            <span class="font-mono rounded bg-gray-300 px-2 py-1 text-blue-600">joris.perrenet@gmail.com</span>.
        </a>
    </p>
</div>
