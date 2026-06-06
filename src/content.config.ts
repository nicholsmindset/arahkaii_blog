import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Astro 6 ships Zod 4 — `z` is imported from 'astro/zod', not 'astro:content'.
import { z } from 'astro/zod';

const posts = defineCollection({
	loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
	schema: ({ image }) =>
		z.object({
			title: z.string().max(110),
			standfirst: z.string().max(220),
			category: z.enum([
				'style',
				'dining',
				'travel',
				'culture',
				'living',
				'people',
				'guides',
			]),
			tags: z.array(z.string()).optional(),
			author: z.string(),
			date: z.coerce.date(),
			readingMinutes: z.number().optional(),
			heroImage: image(),
			heroCaption: z.string(), // required — magazine discipline
			heroCredit: z.string(), // required
			draft: z.boolean().default(false),
			legacyWpSlug: z.string().optional(),
		}),
});

const authors = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/authors' }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			role: z.string(),
			bio: z.string(),
			avatar: image().optional(),
		}),
});

export const collections = { posts, authors };
