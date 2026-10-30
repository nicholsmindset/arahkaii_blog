/**
 * Remove a one-time query flag and return a same-origin history URL.
 * Unrelated query parameters and the fragment are retained.
 */
export function consumeQueryFlag(
	url: string | URL,
	key: string,
	expectedValue: string,
): string | null {
	const next = new URL(url);
	if (next.searchParams.get(key) !== expectedValue) return null;
	next.searchParams.delete(key);
	return `${next.pathname}${next.search}${next.hash}`;
}
