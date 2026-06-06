import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '../lib/seo';

export async function GET(context: APIContext) {
	const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
		(a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
	);

	return rss({
		title: SITE.name,
		description: SITE.tagline,
		site: context.site ?? SITE.url,
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.date,
			description: post.data.metaDescription ?? post.data.standfirst,
			categories: post.data.tags,
			// id is e.g. "2026/quiet-renaissance-…"; the URL uses category + final segment.
			link: `/${post.data.category}/${post.id.split('/').pop()}/`,
		})),
		customData: `<language>en-GB</language>`,
	});
}
