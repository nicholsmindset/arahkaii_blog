export const SIX_MONTHS_MS = 182 * 24 * 60 * 60 * 1000;

/** Classify a verification date before it is used as an editorial freshness claim. */
export function verificationDateIssue(date, now = Date.now()) {
	const verifiedAt = date.valueOf();
	if (verifiedAt > now) return 'future';
	if (now - verifiedAt > SIX_MONTHS_MS) return 'stale';
	return null;
}
