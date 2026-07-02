// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

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
 * One pass over post frontmatter at config load, feeding two things:
 * — 301s from the legacy WordPress permalink (root-level `/<legacyWpSlug>`) to
 *   the canonical category path `/<category>/<slug>/` (the Netlify adapter
 *   renders these into `_redirects` as 301 permanent);
 * — a canonical-path → lastmod map for the sitemap, from `updatedDate` falling
 *   back to `date`, so lastmod reflects real editorial changes rather than the
 *   build timestamp (a fresh lastmod on every deploy teaches crawlers to
 *   ignore the field).
 */
function scanPosts() {
	const dir = path.resolve('src/content/posts');
	/** @type {Record<string, string>} */
	const redirects = {};
	/** @type {Map<string, string>} */
	const lastmodByPath = new Map();
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
				if (!category) continue;
				if (/^draft:\s*true/m.test(fm)) continue;
				const slug = entry.name.replace(/\.(md|mdx)$/, '');
				const dest = `/${category}/${slug}/`;
				const modified = fmField(fm, 'updatedDate') ?? fmField(fm, 'date');
				if (modified && !Number.isNaN(Date.parse(modified)))
					lastmodByPath.set(dest, new Date(modified).toISOString());
				const legacy = fmField(fm, 'legacyWpSlug');
				if (!legacy) continue;
				if (CATEGORIES.has(legacy)) continue; // never shadow a category index
				if (`/${legacy}` !== dest) redirects[`/${legacy}`] = dest;
			}
		}
	};
	try {
		walk(dir);
	} catch {
		// no posts yet — nothing to redirect or stamp
	}
	return { redirects, lastmodByPath };
}

const { redirects: legacyRedirects, lastmodByPath } = scanPosts();

// https://astro.build/config
export default defineConfig({
	site: 'https://arahkaii.com',
	// Directory output → canonical URLs carry a trailing slash; the per-page
	// <link rel="canonical"> in Seo.astro disambiguates the slashless variant.
	redirects: {
		...legacyRedirects,
		// Renamed WordPress pages → our canonical paths.
		'/about-us': '/about',
		'/contact-us': '/contact',
	},
	integrations: [
		mdx(),
		sitemap({
			// Keep non-canonical surfaces out of the index map. Per-post `noindex`
			// is enforced authoritatively via the <meta name="robots"> tag in Seo.astro
			// (Google honours the tag over sitemap inclusion).
			filter: (page) => !page.includes('/404'),
			// Real lastmod for posts (from frontmatter); none for other pages —
			// an invented timestamp is worse than no timestamp.
			serialize: (item) => {
				const lastmod = lastmodByPath.get(new URL(item.url).pathname);
				return {
					...item,
					...(lastmod ? { lastmod } : {}),
					changefreq: ChangeFreqEnum.WEEKLY,
					priority: 0.7,
				};
			},
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
