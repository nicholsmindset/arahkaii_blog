// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

// Tailwind v4 is wired via PostCSS (postcss.config.mjs), not @tailwindcss/vite,
// to sidestep the Astro 6 rolldown build bug (withastro/astro#16542).

// https://astro.build/config
export default defineConfig({
	site: 'https://arahkaii.com',
	integrations: [mdx(), sitemap()],
	// Static output; the Netlify adapter enables forms, build hooks and
	// redirect translation when we add server features later.
	adapter: netlify(),
	image: {
		// Future Cloudflare R2 CDN for generated/sourced imagery. Harmless now.
		domains: ['cdn.arahkaii.com'],
	},
});
