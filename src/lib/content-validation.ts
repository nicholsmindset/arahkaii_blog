interface SourceLink {
	url: string;
}

/** Return the indexes of source entries whose canonical URL appeared earlier. */
export function duplicateSourceUrlIndexes(sources: SourceLink[]): number[] {
	const seen = new Set<string>();
	const duplicates: number[] = [];

	for (const [index, source] of sources.entries()) {
		const canonicalUrl = new URL(source.url).href;
		if (seen.has(canonicalUrl)) duplicates.push(index);
		else seen.add(canonicalUrl);
	}

	return duplicates;
}
