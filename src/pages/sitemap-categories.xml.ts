// Category archives segment — lastmod tracks each section's newest story.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { urlset } from '../lib/sitemap';

export const prerender = true;

const CATEGORIES = ['style', 'beauty', 'dining', 'travel', 'culture', 'living', 'people', 'guides'];

export const GET: APIRoute = async () => {
	const posts = await getCollection('posts', ({ data }) => !data.draft);
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
