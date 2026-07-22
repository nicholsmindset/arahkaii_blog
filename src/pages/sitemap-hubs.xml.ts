// Hubs segment — the latest archive, franchise hubs and topic-cluster hubs.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { urlset, type SitemapEntry } from '../lib/sitemap';
import { getPosts, LATEST_PAGE_SIZE } from '../lib/articles';

export const prerender = true;

export const GET: APIRoute = async () => {
	const [franchises, clusters, posts] = await Promise.all([
		getCollection('franchises'),
		getCollection('clusters'),
		getPosts(),
	]);
	// /latest is paginated — list every page so the segment stays in lockstep
	// with the build (validate-build enforces parity).
	const latestPages = Math.max(1, Math.ceil(posts.length / LATEST_PAGE_SIZE));
	const entries: SitemapEntry[] = [
		{ path: '/latest/', changefreq: 'daily', priority: 0.7 },
		{ path: '/franchises/', changefreq: 'weekly', priority: 0.5 },
		{ path: '/topics/', changefreq: 'weekly', priority: 0.5 },
		...Array.from({ length: latestPages - 1 }, (_, i) => ({
			path: `/latest/${i + 2}/`,
			changefreq: 'weekly' as const,
			priority: 0.4,
		})),
		...franchises.map((entry) => ({ path: `/franchises/${entry.id}/`, changefreq: 'weekly' as const, priority: 0.6 })),
		...clusters.map((entry) => ({ path: `/topics/${entry.id}/`, changefreq: 'weekly' as const, priority: 0.6 })),
	];
	return urlset(entries);
};
