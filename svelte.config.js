import adapter from '@sveltejs/adapter-static';
import htmlMinifierAdapter from 'sveltekit-html-minifier';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: htmlMinifierAdapter(adapter()),
		prerender: {
			handleHttpError: ({ path, message }) => {
				const externalRoots = [
					'/blog', '/durak', '/durak-online', '/VectorMation',
					'/pet-detective', '/practice-math',
					'/MasterThesis', '/BachelorThesis'
				];
				if (externalRoots.some((p) => path.startsWith(p))) return;
				throw new Error(message);
			}
		}
	}
};

export default config;
