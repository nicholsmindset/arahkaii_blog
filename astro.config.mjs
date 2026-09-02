// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

// Tailwind v4 is wired via PostCSS (postcss.config.mjs), not @tailwindcss/vite,
// to sidestep the Astro 6 rolldown build bug (withastro/astro#16542).

const CATEGORIES = new Set([
	'style',
	'beauty',
	'dining',
	'travel',
	'culture',
	'living',
	'people',
	'guides',
]);

/**
 * 301s from the legacy WordPress permalink (root-level `/<legacyWpSlug>`) to the
 * canonical category path `/<category>/<slug>/`. Read straight from post
 * frontmatter at config load so it stays in sync as content changes. The
 * Astro renders these as permanent redirects through the active host adapter.
 */
function legacyRedirects() {
	const dir = path.resolve('src/content/posts');
	const now = new Date();
	/** @type {Record<string, string>} */
	const out = {};
	const fmField = (/** @type {string} */ fm, /** @type {string} */ key) =>
		(fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm')) || [])[1]
			?.trim()
			.replace(/^['"]|['"]$/g, '');
	const walk = (/** @type {string} */ d) => {
		for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
			const p = path.join(d, entry.name);
			if (entry.isDirectory()) {
				walk(p);
			} else if (/\.(md|mdx)$/.test(entry.name)) {
				const src = fs.readFileSync(p, 'utf8');
				const fm = src.split('---')[1] ?? '';
				const category = fmField(fm, 'category');
				const legacy = fmField(fm, 'legacyWpSlug');
				const date = fmField(fm, 'date');
				if (!category || !legacy) continue;
				if (/^draft:\s*true/m.test(fm)) continue;
				// Scheduled posts do not get a production route until their publication
				// date, so their legacy URL must not redirect to a missing destination.
				if (date && new Date(date) > now) continue;
				if (CATEGORIES.has(legacy)) continue; // never shadow a category index
				const slug = entry.name.replace(/\.(md|mdx)$/, '');
				const dest = `/${category}/${slug}/`;
				if (`/${legacy}` !== dest) out[`/${legacy}`] = dest;
			}
		}
	};
	try {
		walk(dir);
	} catch {
		// no posts yet — nothing to redirect
	}
	return out;
}

// https://astro.build/config
export default defineConfig({
	site: 'https://www.arahkaii.com',
	// Directory output → canonical URLs carry a trailing slash; enforce it so the
	// slashless variant 301s instead of serving a duplicate (paired with
	// vercel.json "trailingSlash": true). Seo.astro canonical stays authoritative.
	trailingSlash: 'always',
	redirects: {
		...legacyRedirects(),
		// 1-for-1 map of every published WordPress URL whose path changed —
		// the old permalinks were category-prefixed (/fashion/<slug>/) and many
		// posts were recategorised. Generated from real-export.xml; see
		// src/data/legacy-redirects.json (includes the old WP sitemap names).
		...JSON.parse(fs.readFileSync('./src/data/legacy-redirects.json', 'utf8')),
		// Renamed WordPress pages → our canonical paths.
		'/about-us': '/about',
		'/contact-us': '/contact',
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
	// Prefetch in-viewport links (the site is prerendered, so a hover/viewport
	// prefetch makes View-Transition navigation feel instant).
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'viewport',
	},
});
