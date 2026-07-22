// Tag archives segment — the themes index plus every tag meeting MIN_TAG_POSTS.
import type { APIRoute } from 'astro';
import { urlset, type SitemapEntry } from '../lib/sitemap';
import { getTagIndex } from '../lib/articles';

export const prerender = true;

export const GET: APIRoute = async () => {
	const tagIndex = await getTagIndex();
	const entries: SitemapEntry[] = [
		{ path: '/tags/', changefreq: 'weekly', priority: 0.5 },
		...[...tagIndex.keys()].map((tag) => ({
			path: `/tags/${tag}/`,
			changefreq: 'weekly' as const,
			priority: 0.5,
		})),
	];
	return urlset(entries);
};
