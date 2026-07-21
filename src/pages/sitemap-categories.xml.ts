// Category archives segment — lastmod tracks each section's newest story.
import type { APIRoute } from 'astro';
import { urlset } from '../lib/sitemap';
import { getPosts } from '../lib/articles';
import { CATEGORIES } from '../lib/taxonomy';

export const prerender = true;

export const GET: APIRoute = async () => {
	const posts = await getPosts();
	return urlset(
		CATEGORIES.map((category) => {
			const newest = posts
				.filter((post) => post.data.category === category)
				.reduce<Date | undefined>((latest, post) => {
					const d = post.data.updatedDate ?? post.data.date;
					return !latest || d > latest ? d : latest;
				}, undefined);
			return {
				path: `/${category}/`,
				lastmod: newest,
				changefreq: 'daily' as const,
				priority: 0.6,
			};
		}),
	);
};
