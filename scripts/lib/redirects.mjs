import fs from 'node:fs';
import path from 'node:path';

export const CATEGORIES = [
	'style',
	'beauty',
	'dining',
	'travel',
	'culture',
	'living',
	'people',
	'guides',
];

const POSTS_DIR = path.resolve('src/content/posts');
const LEGACY_REDIRECTS_FILE = path.resolve('src/data/legacy-redirects.json');

const walk = (dir) =>
	fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const item = path.join(dir, entry.name);
		return entry.isDirectory() ? walk(item) : item;
	});

const frontmatter = (source) => source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
const field = (block, key) =>
	block
		.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?\\s*$`, 'm'))?.[1]
		?.trim();

/** Root-level WordPress post URLs → current category URLs. */
export function postRedirects() {
	const redirects = {};
	for (const file of walk(POSTS_DIR).filter((item) => /\.mdx?$/.test(item))) {
		const block = frontmatter(fs.readFileSync(file, 'utf8'));
		if (field(block, 'draft') === 'true') continue;
		const category = field(block, 'category');
		const legacy = field(block, 'legacyWpSlug');
		if (!category || !legacy || CATEGORIES.includes(legacy)) continue;
		const slug = path.basename(file).replace(/\.mdx?$/, '');
		const destination = `/${category}/${slug}/`;
		if (`/${legacy}/` !== destination) redirects[`/${legacy}`] = destination;
	}
	return redirects;
}

/** Every historical WordPress route we know, from one canonical source. */
export function redirectMap() {
	const exported = JSON.parse(fs.readFileSync(LEGACY_REDIRECTS_FILE, 'utf8'));
	const categoryArchives = Object.fromEntries(
		CATEGORIES.map((category) => [`/category/${category}`, `/${category}/`]),
	);
	return {
		...exported,
		...postRedirects(),
		...categoryArchives,
		'/category/fashion': '/style/',
		'/wp-sitemap.xml': '/sitemap-index.xml',
		'/about-us': '/about/',
		'/contact-us': '/contact/',
	};
}

export function vercelRedirects() {
	const redirects = [
		{
			source: '/:path*',
			has: [{ type: 'host', value: 'arahkaii.com' }],
			destination: 'https://www.arahkaii.com/:path*',
			permanent: true,
		},
	];
	for (const [source, destination] of Object.entries(redirectMap())) {
		for (const variant of new Set([source.replace(/\/$/, ''), `${source.replace(/\/$/, '')}/`])) {
			redirects.push({ source: variant, destination, permanent: true });
		}
	}
	return redirects;
}
