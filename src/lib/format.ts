// Shared formatting helpers — British English throughout (brand voice).

/** "16 May 2026" — the publication's standard date form. */
export function fmtDate(date: Date, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }): string {
	return new Intl.DateTimeFormat('en-GB', {
		...options,
		// Match the Singapore editorial calendar, independent of build-server TZ.
		timeZone: 'Asia/Singapore',
	}).format(date);
}

/** Capitalise the first letter (used to turn the category enum into a label). */
export const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** "quiet-luxury" → "Quiet Luxury" — human-readable tag label. */
export const prettifyTag = (t: string): string =>
	t.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
