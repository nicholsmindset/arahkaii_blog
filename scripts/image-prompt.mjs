// image-prompt.mjs — the editorial prompt base (pure, no secrets).
// Forces "not-AI-y", on-brand, modest-luxury output. Used by image-gen.mjs and
// reusable when sourcing falls back to generation.

const RATIOS = { hero: '16:9', inline: '3:2', portrait: '4:5', square: '1:1' };

/**
 * @param {string} subject  what the image depicts, e.g. "a hand-finished seam in a Seoul atelier"
 * @param {object} [opts]
 * @param {'hero'|'inline'|'portrait'|'square'} [opts.kind]
 * @param {string} [opts.extra]  optional extra art direction
 */
export function buildPrompt(subject, opts = {}) {
	const kind = opts.kind ?? 'inline';
	const ratio = RATIOS[kind] ?? '3:2';
	// Hero/featured images run full-bleed under the nav and are re-cropped across
	// breakpoints, so the subject must stay centred in the safe zone; inline and
	// editorial shots keep the off-centre rule-of-thirds composition.
	const composition =
		kind === 'hero' || kind === 'square'
			? 'Primary subject centred in frame within the central safe zone (middle ~60%) so it survives a full-bleed 16:9 crop and tighter mobile crops, generous even negative space around it, narrow depth of field.'
			: 'Rule of thirds, generous negative space, narrow depth of field.';
	return [
		'Editorial photograph, luxury Asian publication.',
		`Subject: ${subject}.`,
		composition,
		'Soft natural window light from left, warm 4200K.',
		'Muted, slightly desaturated grade, warm shadows, ivory highlights.',
		'Modest dress (no exposed shoulders/knees, no alcohol/bar/nightlife).',
		`${ratio}.`,
		'Photographic not illustrated. No text, logos, or watermarks.',
		opts.extra ? opts.extra : '',
	]
		.filter(Boolean)
		.join(' ');
}

// Site-wide grade applied in CSS to all real images (keep generated output in
// the same key): filter: contrast(1.02) saturate(0.96).
export const SITE_IMAGE_FILTER = 'contrast(1.02) saturate(0.96)';
