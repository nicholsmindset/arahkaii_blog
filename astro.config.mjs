// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';
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
				if (!category || !legacy) continue;
				if (/^draft:\s*true/m.test(fm)) continue;
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
	site: 'https://arahkaii.com',
	// Directory output → canonical URLs carry a trailing slash; the per-page
	// <link rel="canonical"> in Seo.astro disambiguates the slashless variant.
	redirects: {
		...legacyRedirects(),
		// Renamed WordPress pages → our canonical paths.
		'/about-us': '/about',
		'/contact-us': '/contact',
	},
	integrations: [
		react(),
		keystatic(),
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
				changefreq: ChangeFreqEnum.WEEKLY,
				priority: 0.7,
			}),
			i18n: {
				defaultLocale: 'en-GB',
				locales: { 'en-GB': 'en-GB' },
			},
		}),
	],
	// Vercel serverless output powers the Keystatic API and newsletter endpoint
	// while editorial pages remain prerendered for speed and resilience.
	adapter: vercel(),
	image: {
		// Future Cloudflare R2 CDN for generated/sourced imagery. Harmless now.
		domains: ['cdn.arahkaii.com'],
	},
});
