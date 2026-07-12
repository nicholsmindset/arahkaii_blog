// image-templates.mjs — executable mirror of references/image-system.md §3–§4.
//
// The Markdown file stays the human-facing canon; THIS file is the machine copy
// the illustrate pipeline reads. If you edit one, edit the other.
// Each pillar has one hero template + two inline templates (rotated per H2).
// `human: true` marks templates with faces/hands → routed to the fidelity model.
// Pattern functions take a `subject` noun-phrase and return the locked prompt
// (lighting · composition · palette · camera). assemblePrompt() appends ANTI_SLOP.

// §4 — append to every prompt's tail. Non-negotiable.
export const ANTI_SLOP =
	'film grain, no AI sheen, natural skin texture with pores, asymmetrical features, ' +
	'no extra fingers, no symmetrical perfection, no harsh studio flash, ' +
	'no plastic gloss, no over-saturation, no rainbow refraction, no HDR, ' +
	'shot on real film stock (Portra 400 / Ektar 100 / Tri-X 400), ' +
	'editorial photography, magazine-grade, no stock-photo composition';

// §3 — the 24 locked templates. `h` = hero composition (centred safe zone),
// `i` = inline composition (rule of thirds). Subject is interpolated into the
// template's lead "[Subject + scene]" slot.
const T = {
	// 3.1 STYLE
	S1: {
		human: true,
		text: (s) =>
			`A modern Asian woman in modest dress, ${s}, standing in three-quarter profile, looking away from camera, editorial fashion photography in the style of Vogue Arabia and i-D Magazine, soft window light from camera-left at 45 degrees, rule of thirds composition with negative space on the right, palette of warm paper, taupe and clay, visible fabric weave and natural hand-feel, shot on Mamiya 7 medium format with 80mm lens, slightly desaturated`,
	},
	S2: {
		human: false,
		text: (s) =>
			`Close-up flat lay of ${s} on a warm paper surface, top-down editorial product photography, soft diffused daylight from above-left, rule of thirds composition with one folded edge entering frame, palette of paper, taupe, sage, hand-built ceramic dish in corner as scale reference, visible fabric weave, shot on Hasselblad with 80mm lens, no shadow dropoff`,
	},
	S3: {
		human: true,
		text: (s) =>
			`A pair of anatomically-correct Asian hands styling ${s}, cropped at the wrist, soft side-light from a single window, palette of paper, clay and gold, hand-built ceramic and natural linen in frame, shot on Leica M11 with 50mm lens`,
	},
	// 3.2 BEAUTY
	B1: {
		human: false,
		text: (s) =>
			`${s} on a pale ceramic surface, soft top-light from a north-facing window, palette of paper and rose clay, one shallow water droplet visible for freshness, shot on Phase One IQ4 with 120mm macro lens, no studio backdrop`,
	},
	B2: {
		human: false,
		text: (s) =>
			`${s} on a hand-built ceramic dish, side-light from camera-left at low angle, rule of thirds composition with negative space on right, palette of paper, warm paper and gold, shot on Hasselblad H6D with 100mm lens, no harsh reflection`,
	},
	B3: {
		human: false,
		text: (s) =>
			`A calm clinical treatment room interior evoking ${s}, single treatment bed dressed in white linen, soft late-afternoon light through linen curtain, palette of paper, taupe, sage, single hand-built ceramic vessel on a side table, blurred plant in background, shot on Mamiya 7 with 80mm lens, no medical-stock-photo people, no clinical-blue tones`,
	},
	// 3.3 DINING
	D1: {
		human: false,
		text: (s) =>
			`${s} on a hand-built ceramic plate, dim ambient restaurant lighting with one warm spot from above-left, low-angle shot at 30 degrees from horizontal, palette of warm paper, clay and black tea, blurred dining room in background, shot on Sony A7R V with 50mm lens at f/2, no harsh flash, no alcohol visible`,
	},
	D2: {
		human: true,
		text: (s) =>
			`A hand pouring tea into a small ceramic cup, evoking ${s}, 45-degree angle, soft daylight from window at camera-left, palette of paper, sage and clay, visible steam rising, one folded linen napkin in frame, shot on Fujifilm GFX100 with 63mm lens, no extra hands, no wine glasses anywhere`,
	},
	D3: {
		human: false,
		text: (s) =>
			`A quiet dessert bar interior at dusk evoking ${s}, three empty seats at a wooden counter, single pendant light, blurred figure of a server in background, palette of black tea, clay and gold, candlelight on the counter, hand-built ceramics stacked at the back, shot on Leica Q3 with 28mm lens, no bottles, no neon signage, no crowds`,
	},
	// 3.4 TRAVEL
	T1: {
		human: false,
		text: (s) =>
			`A quiet hotel room corner evoking ${s}, linen bedsheets folded back, single small window with sheer linen curtain, golden-hour light filtering in, palette of paper, warm paper and gold, single hand-built ceramic on the bedside table, a folded prayer rug on the chair, shot on Mamiya 7 with 65mm lens, no champagne bucket, no minibar`,
	},
	T2: {
		human: false,
		text: (s) =>
			`A narrow Asian street in early morning evoking ${s}, single human figure walking away from camera in modest dress, soft warm light raking across one wall, palette of paper, clay and sage, bougainvillea entering the frame, shot on Leica M11 with 35mm lens, no crowds, no tourists`,
	},
	T3: {
		human: false,
		text: (s) =>
			`A market vendor's table of ${s} arranged in shallow wicker baskets, soft overhead daylight from a market awning, palette of rose clay, sage and paper, no human faces in frame, shot on Hasselblad H6D with 80mm lens, no plastic packaging`,
	},
	// 3.5 LIVING
	L1: {
		human: false,
		text: (s) =>
			`An empty modern apartment interior evoking ${s}, oak floor, single mid-century chair in frame, raking afternoon light across one wall, palette of paper, taupe and clay, one hand-thrown ceramic vessel on a low console, single book on the coffee table, shot on Hasselblad H6D with 50mm lens, no maximalist clutter`,
	},
	L2: {
		human: false,
		text: (s) =>
			`${s} on a travertine surface, soft side-light from a single window, palette of warm paper, clay and gold, negative space top-right, shot on Phase One IQ4 with 120mm lens, no busy background`,
	},
	L3: {
		human: false,
		text: (s) =>
			`A modest prayer corner of an apartment evoking ${s}, single folded prayer rug on hardwood, a small shelf with a Qur'an and an unlit candle, soft window light from camera-right, palette of paper, sage and clay, shot on Mamiya 7 with 80mm lens, editorial restraint, never exotica`,
	},
	// 3.6 PEOPLE
	P1: {
		human: true,
		text: (s) =>
			`A portrait of ${s} in their own space, three-quarter view, looking slightly off-camera, hands at work or at rest in lap, soft window light from camera-left, palette of paper, warm paper and clay, blurred working environment behind them, shot on Mamiya 7 with 80mm lens, natural skin texture, asymmetrical face, no posed corporate-headshot smile`,
	},
	P2: {
		human: true,
		text: (s) =>
			`Close-up of ${s}, anatomically correct hands at work, cropped above the wrist, soft warm light from one window, palette of warm paper, clay and rose clay, shallow depth of field, shot on Leica M11 with 50mm lens, no extra fingers`,
	},
	P3: {
		human: true,
		text: (s) =>
			`A wide editorial portrait of ${s} standing or sitting in their studio, full or three-quarter body, raking afternoon light from camera-left, palette of paper, taupe, sage and clay, working tools or finished products visible but not foregrounded, shot on Hasselblad H6D with 50mm lens, no posed magazine-cover stance`,
	},
	// 3.7 CULTURE
	C1: {
		human: false,
		text: (s) =>
			`An editorial still life representing ${s}, three objects with intentional spacing, soft top-down north light, palette of paper, clay and ink, museum-grade composition, shot on Phase One IQ4 with 120mm lens, no clutter, no labels`,
	},
	C2: {
		human: true,
		text: (s) =>
			`A single Asian woman in modest dress representing ${s}, standing in a culturally specific setting, soft window light, three-quarter profile, palette of paper, warm paper and clay, blurred contextual elements behind her, shot on Mamiya 7 with 80mm lens, no tourist gaze, no costume-y styling`,
	},
	C3: {
		human: false,
		text: (s) =>
			`A close-up architectural detail evoking ${s}, soft raking afternoon light, palette of paper, clay and ink, no human in frame, shot on Leica M11 with 50mm lens, no Photoshop sharpening`,
	},
	// 3.8 GUIDES
	G1: {
		human: false,
		text: (s) =>
			`A single hero scene representing ${s}, one clear focal point, generous negative space top or left, palette of paper, warm paper and clay, soft natural light from camera-left, shot on Hasselblad H6D with 80mm lens, no collage of multiple subjects`,
	},
	G2: {
		human: false,
		text: (s) =>
			`A top-down editorial flat lay representing ${s}, on a paper surface, soft overhead daylight, palette of paper, sage and gold, intentional asymmetric composition with negative space top-right, shot on Phase One IQ4 with 80mm lens, no Photoshop drop shadows`,
	},
	G3: {
		human: false,
		text: (s) =>
			`A quiet evening scene evoking ${s}, single warm light source, palette of black tea, clay, gold, candlelight in frame, single figure in modest dress in soft focus background, shot on Sony A7R V with 35mm lens at f/2, no bottles, no club lighting, no crowds`,
	},
};

// Pillar → which template is the hero, which two rotate across inline H2s.
export const TEMPLATES = {
	style: { hero: 'S1', inline: ['S2', 'S3'] },
	beauty: { hero: 'B1', inline: ['B2', 'B3'] },
	dining: { hero: 'D1', inline: ['D2', 'D3'] },
	travel: { hero: 'T1', inline: ['T2', 'T3'] },
	living: { hero: 'L1', inline: ['L2', 'L3'] },
	people: { hero: 'P1', inline: ['P2', 'P3'] },
	culture: { hero: 'C1', inline: ['C2', 'C3'] },
	guides: { hero: 'G1', inline: ['G2', 'G3'] },
};

/** Look up a single template pattern by its id (e.g. 'S1'). */
export function getTemplate(id) {
	return T[id];
}

export const PILLARS = Object.keys(TEMPLATES);
