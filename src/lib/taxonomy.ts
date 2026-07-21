// Single source of truth for the eight-category taxonomy. The content schema,
// nav, category routes and sitemaps all read from here — add or rename a
// category in exactly one place.
export const CATEGORIES = [
	'style',
	'beauty',
	'dining',
	'travel',
	'culture',
	'living',
	'people',
	'guides',
] as const;

export type Category = (typeof CATEGORIES)[number];
