export function hasUniqueNormalisedValues<T>(
	items: T[],
	value: (item: T) => string,
): boolean {
	const seen = new Set<string>();
	for (const item of items) {
		const normalised = value(item).trim().toLocaleLowerCase('en');
		if (seen.has(normalised)) return false;
		seen.add(normalised);
	}
	return true;
}
