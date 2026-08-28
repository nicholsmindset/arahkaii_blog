// One source of truth for "a story as a card". Every listing surface
// (home, category, latest, related, author, search) reads from here so the
// shape of a card is defined once.
import { getCollection, type CollectionEntry } from 'astro:content';
import { cap } from './format';

export type Tone = 'tone-b' | 'tone-c' | 'tone-d';
const TONES: Tone[] = ['tone-b', 'tone-c', 'tone-d'];

/**
 * True on Vercel preview/development deploys (never production, never local
 * `npm run verify` where VERCEL_ENV is unset). Gates draft article routes so
 * editors get a shareable preview URL without the draft entering any listing,
 * sitemap or the production build.
 */
export const isPreviewBuild =
	!!process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';

/** Deterministic tonal crop for placeholder/cards, varied by position. */
export function toneFor(i: number): Tone {
	return TONES[i % TONES.length];
}

/**
 * Estimate reading time from raw MDX body at ~225 wpm (average adult prose
 * speed). Strips nothing fancy — frontmatter is already excluded from `.body`,
 * and the small overcount from markdown/JSX tokens is negligible at this rate.
 */
export function estimateReadingMinutes(body: string | undefined): number {
	const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 225));
}

export interface PostCard {
	id: string;
	slug: string;
	url: string;
	title: string;
	standfirst: string;
	category: string; // lowercase enum
	categoryLabel: string; // Capitalised
	tags: string[];
	author: string; // author id
	authorName: string;
	byline: string; // "By <name>"
	date: Date;
	readingMinutes?: number;
	tone: Tone;
	image: ImageMetadata;
	heroCaption: string;
	franchise?: string;
	cluster?: string;
	isPillar: boolean;
}

/** Page size for the paginated /latest archive (and its sitemap segment). */
export const LATEST_PAGE_SIZE = 24;

/**
 * All listed posts, newest first. "Listed" excludes drafts, `noindex` posts
 * (they keep their own page but stay out of listings, search and RSS) and
 * future-dated posts (scheduled — they appear on the first build after their
 * date).
 */
export async function getPosts(): Promise<CollectionEntry<'posts'>[]> {
	const now = new Date();
	const posts = await getCollection(
		'posts',
		({ data }) => !data.draft && !data.noindex && data.date <= now,
	);
	return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

let cardsCache: PostCard[] | null = null;

/** All published posts as cards, newest first (memoised per build process). */
export async function getCards(): Promise<PostCard[]> {
	if (cardsCache) return cardsCache;
	const [posts, authors] = await Promise.all([
		getPosts(),
		getCollection('authors'),
	]);
	const nameById = new Map(authors.map((a) => [a.id, a.data.name]));
	cardsCache = posts.map((p, i) => {
		const slug = p.id.split('/').pop()!;
		const category = p.data.category;
		const authorName = nameById.get(p.data.author) ?? p.data.author;
		return {
			id: p.id,
			slug,
			url: `/${category}/${slug}/`,
			title: p.data.title,
			standfirst: p.data.standfirst,
			category,
			categoryLabel: cap(category),
			tags: p.data.tags ?? [],
			author: p.data.author,
			authorName,
			byline: `By ${authorName}`,
			date: p.data.date,
			readingMinutes: p.data.readingMinutes ?? estimateReadingMinutes(p.body),
			tone: toneFor(i),
			image: p.data.heroImage,
			heroCaption: p.data.heroCaption,
			franchise: p.data.franchise,
			cluster: p.data.cluster,
			isPillar: p.data.isPillar,
		};
	});
	return cardsCache;
}

/**
 * A tag needs at least this many published stories to earn its own archive
 * page — below it, the tag stays a filter chip only (no thin, near-empty URL).
 */
export const MIN_TAG_POSTS = 2;

let tagIndexCache: Map<string, PostCard[]> | null = null;

/**
 * Tag → cards (newest first), only tags meeting MIN_TAG_POSTS, keys sorted
 * alphabetically. Memoised per build.
 */
export async function getTagIndex(): Promise<Map<string, PostCard[]>> {
	if (tagIndexCache) return tagIndexCache;
	const cards = await getCards();
	const byTag = new Map<string, PostCard[]>();
	for (const card of cards) {
		for (const tag of card.tags) {
			(byTag.get(tag) ?? byTag.set(tag, []).get(tag)!).push(card);
		}
	}
	tagIndexCache = new Map(
		[...byTag.entries()]
			.filter(([, list]) => list.length >= MIN_TAG_POSTS)
			.sort(([a], [b]) => a.localeCompare(b)),
	);
	return tagIndexCache;
}

/** Slim, JSON-serialisable index for the client search overlay. */
export async function getSearchIndex() {
	const cards = await getCards();
	return cards.map((c) => ({
		t: c.title,
		c: c.categoryLabel,
		a: c.authorName,
		// Search-only copy: keep taxonomy and dek discoverable without exposing
		// extra fields in the rendered result card.
		k: [...c.tags, c.standfirst].join(' '),
		h: c.url,
		d: c.date.toISOString(),
		r: c.readingMinutes ?? null,
	}));
}
