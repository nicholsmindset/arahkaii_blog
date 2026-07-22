// Safe serialisation helpers for content-derived strings that end up in HTML.
// Content (titles, author names, standfirsts) can contain arbitrary text, so
// anything interpolated into markup must be neutralised first.

/**
 * JSON for embedding inside a `<script>` block via `set:html`. `JSON.stringify`
 * does NOT escape `<`, so a value containing `</script>` (or `<!--`) would break
 * out of the element and execute. Escaping `<`, `>` and `&` to unicode escapes
 * keeps the JSON valid while making a `</script>` breakout impossible.
 */
export function safeJsonLd(value: unknown): string {
	return JSON.stringify(value)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026');
}

/** Escape a string for safe interpolation into innerHTML/template markup. */
export function escapeHtml(value: string): string {
	return String(value).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
