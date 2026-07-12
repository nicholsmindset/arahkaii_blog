import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Astro 6 ships Zod 4 — `z` is imported from 'astro/zod', not 'astro:content'.
import { z } from 'astro/zod';

const posts = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
	schema: ({ image }) =>
		z.object({
			title: z.string().max(110),
			standfirst: z.string().max(220),
			category: z.enum([
				'style',
				'beauty',
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
			// SEO overrides — all optional, additive (existing posts still build).
			seoTitle: z.string().max(70).optional(),
			metaDescription: z.string().max(160).optional(),
			updatedDate: z.coerce.date().optional(),
			noindex: z.boolean().default(false),
			// GEO / AIO structured data — additive. Presence drives the schema:
			//   faq → FAQPage · howTo → HowTo · listItems → ItemList.
			faq: z
				.array(z.object({ q: z.string(), a: z.string() }))
				.optional(),
			howToName: z.string().optional(),
			howTo: z
				.array(z.object({ name: z.string(), text: z.string() }))
				.optional(),
			listName: z.string().optional(),
			listItems: z.array(z.string()).optional(),
			kicker: z.string().optional(),
			articleType: z.enum(['feature', 'listicle', 'guide', 'profile', 'longread', 'brief']).optional(),
			franchise: z.string().optional(),
			cluster: z.string().optional(),
			isPillar: z.boolean().default(false),
			timeliness: z.enum(['evergreen', 'timely']).default('evergreen'),
			atAGlance: z.array(z.object({
				name: z.string(),
				verdict: z.string(),
				halalStatus: z.string().optional(),
				url: z.string().optional(),
			})).optional(),
			halalStatus: z.object({
				status: z.enum(['muis-certified', 'muslim-owned', 'pork-free-no-alcohol', 'mixed-status-guide', 'not-applicable']),
				verifiedDate: z.coerce.date().optional(),
				certificateRef: z.string().optional(),
				sourceUrl: z.url().optional(),
				note: z.string().optional(),
			}).optional(),
			reviewedBy: z.string().optional(),
			lastVerified: z.coerce.date().optional(),
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
			sameAs: z.array(z.url()).optional(),
			expertise: z.array(z.string()).optional(),
		}),
});

const franchises = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/franchises' }),
	schema: ({ image }) => z.object({
		name: z.string(),
		description: z.string(),
		kicker: z.string().optional(),
		cadence: z.string().optional(),
		heroImage: image().optional(),
	}),
});

const clusters = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/clusters' }),
	schema: z.object({
		name: z.string(),
		description: z.string(),
		pillarPost: z.string().optional(),
		targetKeyword: z.string().optional(),
	}),
});

export const collections = { posts, authors, franchises, clusters };
