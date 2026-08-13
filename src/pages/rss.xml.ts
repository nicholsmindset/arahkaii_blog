import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../lib/seo';
import { getPosts } from '../lib/articles';

// The feed is derived entirely from build-time content, so emit it as a static
// asset instead of invoking a serverless function for every feed reader poll.
export const prerender = true;

export async function GET(context: APIContext) {
	// getPosts already excludes drafts, noindex and future-dated posts.
	const posts = await getPosts();

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
