// Hubs segment — the latest archive, franchise hubs and topic-cluster hubs.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { urlset, type SitemapEntry } from '../lib/sitemap';

export const prerender = true;

export const GET: APIRoute = async () => {
	const [franchises, clusters] = await Promise.all([
		getCollection('franchises'),
		getCollection('clusters'),
	]);
	const entries: SitemapEntry[] = [
		{ path: '/latest/', changefreq: 'daily', priority: 0.7 },
		...franchises.map((entry) => ({ path: `/franchises/${entry.id}/`, changefreq: 'weekly' as const, priority: 0.6 })),
		...clusters.map((entry) => ({ path: `/topics/${entry.id}/`, changefreq: 'weekly' as const, priority: 0.6 })),
	];
	return urlset(entries);
};
