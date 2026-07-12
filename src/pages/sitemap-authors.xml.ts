// Authors segment — contributor profiles (Person-schema anchors).
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { urlset } from '../lib/sitemap';

export const prerender = true;

export const GET: APIRoute = async () => {
	const authors = await getCollection('authors');
	return urlset(
		authors.map((author) => ({
			path: `/authors/${author.id}/`,
			changefreq: 'monthly' as const,
			priority: 0.3,
		})),
	);
};
