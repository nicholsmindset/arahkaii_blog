/**
 * Turn a stored reading-list href into a same-origin path. Saved stories are
 * client-owned data, so treat localStorage values as untrusted before placing
 * them back into an anchor.
 */
export function normaliseSavedStoryHref(href: unknown, origin: string): string | null {
	if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) return null;

	try {
		const base = new URL(origin);
		const url = new URL(href, base);
		if (url.origin !== base.origin || url.username || url.password) return null;
		return `${url.pathname}${url.search}${url.hash}`;
	} catch {
		return null;
	}
}
