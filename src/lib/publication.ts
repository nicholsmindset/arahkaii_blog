export interface RoutablePostData {
	draft?: boolean;
	date: Date;
}

/**
 * Decide whether an article route belongs in the current build.
 *
 * Production only exposes articles whose publication date has arrived. Preview
 * builds additionally expose drafts, including future-dated drafts, so editors
 * can review scheduled work before it is published.
 */
export function shouldBuildPostRoute(
	data: RoutablePostData,
	now: Date,
	preview: boolean,
): boolean {
	return (preview && data.draft === true) || (!data.draft && data.date <= now);
}
