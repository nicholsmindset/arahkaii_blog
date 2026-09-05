import type { PostCard } from './articles';

/** A category heading is a promise: never pad a desk with unrelated stories. */
export function selectHomepage(cards: PostCard[]) {
 const latest = [...cards].sort((a, b) => b.date.valueOf() - a.date.valueOf() || a.id.localeCompare(b.id));
 const category = (name: string, count: number) => latest.filter(card => card.category === name).slice(0, count);
 return {
  cover: latest[0],
  latest: latest.slice(0, 6),
  style: category('style', 3),
  beauty: category('beauty', 3),
  living: category('living', 3),
  dining: category('dining', 2),
  travel: category('travel', 2),
  culture: latest.filter(card => ['culture', 'people'].includes(card.category)).slice(0, 3),
 };
}
