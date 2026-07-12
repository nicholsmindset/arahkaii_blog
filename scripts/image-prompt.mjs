// image-prompt.mjs — the editorial prompt base (pure, no secrets).
// Forces "not-AI-y", on-brand, modest-luxury output. Used by image-gen.mjs and
// reusable when sourcing falls back to generation.

const RATIOS = { hero: '16:9', inline: '3:2', portrait: '4:5', square: '1:1' };

// The same kinds expressed as <Figure ratio="…"> values, so the orchestrator
// maps kind → Figure prop from one source of truth (mirrors Figure.astro).
const FIGURE_RATIOS = { hero: '16x9', inline: '3x2', portrait: '4x5', square: '1x1' };

/** Map an image kind to the matching <Figure ratio> prop value. */
export function figureRatio(kind) {
	return FIGURE_RATIOS[kind] ?? '3x2';
}

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
		'Arahkaii editorial photograph for a Muslim-owned Asian modern-luxury publication.',
		`Subject: ${subject}.`,
		composition,
		'Observed, intelligent and culturally specific rather than staged or aspirational stock photography.',
		'Photorealistic full-frame editorial camera, 50mm lens, natural perspective, fine skin and material texture, restrained depth of field.',
		'Soft directional daylight, neutral-warm 4200K balance, gentle contrast, ivory highlights, honest shadow detail.',
		'Muted mineral palette with one controlled accent; no heavy teal-orange grading.',
		'Wardrobe and body language are modest, contemporary and regionally credible. Avoid tokenistic religious symbols and orientalist styling.',
		'No alcohol, gambling, nightlife, exposed shoulders or thighs. No unsafe food or false halal-certification cues.',
		`${ratio}.`,
		'No text, logos, watermarks, branded products, duplicated people, malformed hands, plastic skin, surreal architecture, fake news photography or celebrity likenesses.',
		'Leave clean crop-safe negative space for responsive layouts, but never render a headline inside the image.',
		opts.extra ? opts.extra : '',
	]
		.filter(Boolean)
		.join(' ');
}

// Site-wide grade applied in CSS to all real images (keep generated output in
// the same key): filter: contrast(1.02) saturate(0.96).
export const SITE_IMAGE_FILTER = 'contrast(1.02) saturate(0.96)';
