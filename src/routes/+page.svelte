<script>
	import avatar from '$lib/images/personal-logo.svg';
</script>

<svelte:head>
	<title>Joris' website</title>
	<meta name="description" content="Personal Website" />
    <meta name="google-site-verification" content="zi8POYIKt3_zadpQhWa2QHEVLDNG_DwGKcojBNiWi_U" />
</svelte:head>

<div class="flex flex-col place-items-center my-auto">
    <img class="w-56 py-5" src={avatar} alt="avatar"/>
	<h1 class="text-4xl font-light">Joris Perrenet</h1>
	<h2 class="text-xl font-semibold py-1">Math Student</h2>
</div>

<style>
</style>
