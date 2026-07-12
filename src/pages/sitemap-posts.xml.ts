// Articles segment — every published post, pillar guides weighted highest.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { urlset } from '../lib/sitemap';

export const prerender = true;

export const GET: APIRoute = async () => {
	const posts = await getCollection('posts', ({ data }) => !data.draft && !data.noindex);
	return urlset(
		posts
			.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
			.map((post) => ({
				path: `/${post.data.category}/${post.id.split('/').pop()}/`,
				lastmod: post.data.updatedDate ?? post.data.date,
				changefreq: 'weekly' as const,
				priority: post.data.isPillar ? 0.9 : 0.7,
			})),
	);
};
