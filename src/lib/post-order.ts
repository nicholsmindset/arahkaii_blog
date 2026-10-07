export interface DatedEntry {
	id: string;
	data: { date: Date };
}

/** Newest first, with a stable content-ID tie-break for equal timestamps. */
export function comparePostsNewestFirst(a: DatedEntry, b: DatedEntry): number {
	return b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id);
}
