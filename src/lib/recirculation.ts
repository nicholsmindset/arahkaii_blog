import type { PostCard } from './articles';

type Topic = { url: string; category: string; tags: string[]; cluster?: string };

/** Prefer a useful continuation: same series, shared subjects, then the desk. */
export function selectReadNext(cards: PostCard[], current: Topic): PostCard | undefined {
	const score = (card: PostCard) =>
		(current.cluster && card.cluster === current.cluster ? 100 : 0) +
		card.tags.filter((tag) => current.tags.includes(tag)).length * 10 +
		(card.category === current.category ? 5 : 0);
	return cards.filter((card) => card.url !== current.url).sort((a, b) =>
		score(b) - score(a) || b.date.valueOf() - a.date.valueOf() || a.id.localeCompare(b.id)
	)[0];
}
