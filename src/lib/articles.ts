// One source of truth for "a story as a card". Every listing surface
// (home, category, latest, related, author, search) reads from here so the
// shape of a card is defined once.
import { getCollection, type CollectionEntry } from 'astro:content';
import { cap } from './format';

export type Tone = 'tone-b' | 'tone-c' | 'tone-d';
const TONES: Tone[] = ['tone-b', 'tone-c', 'tone-d'];

/** Deterministic tonal crop for placeholder/cards, varied by position. */
export function toneFor(i: number): Tone {
	return TONES[i % TONES.length];
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
}

/** All published posts, newest first. */
export async function getPosts(): Promise<CollectionEntry<'posts'>[]> {
	const posts = await getCollection('posts', ({ data }) => !data.draft);
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
			readingMinutes: p.data.readingMinutes,
			tone: toneFor(i),
			image: p.data.heroImage,
			heroCaption: p.data.heroCaption,
		};
	});
	return cardsCache;
}

/** Slim, JSON-serialisable index for the client search overlay. */
export async function getSearchIndex() {
	const cards = await getCards();
	return cards.map((c) => ({
		t: c.title,
		c: c.categoryLabel,
		a: c.authorName,
		h: c.url,
		d: c.date.toISOString(),
		r: c.readingMinutes ?? null,
	}));
}
