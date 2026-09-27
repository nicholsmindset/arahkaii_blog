/** Normalise reader queries and indexed copy for accent-insensitive matching. */
export function normaliseSearchText(value: string): string {
	return value
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLocaleLowerCase('en-GB');
}
