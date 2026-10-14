const WORDS_PER_MINUTE = 225;

/**
 * Estimate reading time from the prose a reader can actually see.
 *
 * Astro supplies the raw Markdown/MDX body, which also contains imports,
 * component props and link destinations. Strip that authoring syntax before
 * counting so image metadata and implementation details do not inflate the
 * value shown beside an article.
 */
export function estimateReadingMinutes(body: string | undefined): number {
	const prose = (body ?? '')
		.replace(/^\s*(?:import|export)\s.+$/gm, ' ')
		.replace(/<!--[\s\S]*?-->/g, ' ')
		.replace(/<[^>]*>/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/https?:\/\/\S+/g, ' ')
		.replace(/\{[^{}]*\}/g, ' ')
		.replace(/[`*_~>#|=-]/g, ' ');
	const words = prose.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
