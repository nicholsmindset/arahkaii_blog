// Hubs segment — the latest archive, franchise hubs and topic-cluster hubs.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { urlset, type SitemapEntry } from '../lib/sitemap';
import { getPosts, LATEST_PAGE_SIZE } from '../lib/articles';

export const prerender = true;

const newestChange = (posts: Awaited<ReturnType<typeof getPosts>>) =>
	posts.reduce<Date | undefined>((latest, post) => {
		const changed = post.data.updatedDate ?? post.data.date;
		return !latest || changed > latest ? changed : latest;
	}, undefined);

export const GET: APIRoute = async () => {
	const [franchises, clusters, posts] = await Promise.all([
		getCollection('franchises'),
		getCollection('clusters'),
		getPosts(),
	]);
	// /latest is paginated — list every page so the segment stays in lockstep
	// with the build (validate-build enforces parity).
	const latestPages = Math.max(1, Math.ceil(posts.length / LATEST_PAGE_SIZE));
	const latestEntries = Array.from({ length: latestPages }, (_, index) => {
		const pagePosts = posts.slice(index * LATEST_PAGE_SIZE, (index + 1) * LATEST_PAGE_SIZE);
		return {
			path: index === 0 ? '/latest/' : `/latest/${index + 1}/`,
			lastmod: newestChange(pagePosts),
			changefreq: index === 0 ? 'daily' as const : 'weekly' as const,
			priority: index === 0 ? 0.7 : 0.4,
		};
	});
	const entries: SitemapEntry[] = [
		...latestEntries,
		{ path: '/franchises/', lastmod: newestChange(posts.filter((post) => post.data.franchise)), changefreq: 'weekly', priority: 0.5 },
		{ path: '/topics/', lastmod: newestChange(posts.filter((post) => post.data.cluster)), changefreq: 'weekly', priority: 0.5 },
		...franchises.map((entry) => ({
			path: `/franchises/${entry.id}/`,
			lastmod: newestChange(posts.filter((post) => post.data.franchise === entry.id)),
			changefreq: 'weekly' as const,
			priority: 0.6,
		})),
		...clusters.map((entry) => ({
			path: `/topics/${entry.id}/`,
			lastmod: newestChange(posts.filter((post) => post.data.cluster === entry.id)),
			changefreq: 'weekly' as const,
			priority: 0.6,
		})),
	];
	return urlset(entries);
};
