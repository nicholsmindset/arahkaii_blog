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
	integrations: [
		mdx(),
		sitemap({
			// Keep non-canonical surfaces out of the index map. Per-post `noindex`
			// is enforced authoritatively via the <meta name="robots"> tag in Seo.astro
			// (Google honours the tag over sitemap inclusion).
			filter: (page) => !page.includes('/404'),
			// Stamp a fresh lastmod and declare the British-English locale.
			serialize: (item) => ({
				...item,
				lastmod: new Date().toISOString(),
				changefreq: 'weekly',
				priority: 0.7,
			}),
			i18n: {
				defaultLocale: 'en-GB',
				locales: { 'en-GB': 'en-GB' },
			},
		}),
	],
	// Static output; the Netlify adapter enables forms, build hooks and
	// redirect translation when we add server features later.
	adapter: netlify(),
	image: {
		// Future Cloudflare R2 CDN for generated/sourced imagery. Harmless now.
		domains: ['cdn.arahkaii.com'],
	},
});
