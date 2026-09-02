// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import { redirectMap } from './scripts/lib/redirects.mjs';

// Tailwind v4 is wired via PostCSS (postcss.config.mjs), not @tailwindcss/vite,
// to sidestep the Astro 6 rolldown build bug (withastro/astro#16542).

// https://astro.build/config
export default defineConfig({
	site: 'https://www.arahkaii.com',
	// Directory output → canonical URLs carry a trailing slash; enforce it so the
	// slashless variant 301s instead of serving a duplicate (paired with
	// vercel.json "trailingSlash": true). Seo.astro canonical stays authoritative.
	trailingSlash: 'always',
	redirects: {
		...redirectMap(),
	},
	// Sitemaps are hand-rolled, segmented static endpoints (src/pages/
	// sitemap-*.xml.ts) so Search Console reports indexing per content type;
	// scripts/validate-build.mjs enforces sitemap ↔ build parity.
	integrations: [react(), keystatic(), mdx()],
	// Vercel serverless output powers the Keystatic API and newsletter endpoint
	// while editorial pages remain prerendered for speed and resilience.
	adapter: vercel({
		webAnalytics: { enabled: true },
	}),
	image: {
		// Future Cloudflare R2 CDN for generated/sourced imagery. Harmless now.
		domains: ['cdn.arahkaii.com'],
	},
	// Prefetch on intent (the site is prerendered, so hover makes View-Transition
	// navigation feel instant without downloading a page full of visible links).
	prefetch: {
		prefetchAll: true,
		// Avoid fetching every link visible on a magazine-dense homepage. Hover
		// keeps navigation fast without competing with the initial page for bytes.
		defaultStrategy: 'hover',
	},
});
