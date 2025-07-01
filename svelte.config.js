import adapterVercel from '@sveltejs/adapter-vercel';
import adapterNode from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Adapter basierend auf Umgebung wählen
const adapter = process.env.VERCEL 
    ? adapterVercel()
    : adapterNode({
        out: 'build',
        precompress: false,
        envPrefix: ''
    });

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter
    },
    preprocess: vitePreprocess()
};

export default config;
