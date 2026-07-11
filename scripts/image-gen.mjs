// image-gen.mjs — AI image generation (local-first, key-gated).
//
// Provider auto-selects from your .env:
//   • OPENAI_API_KEY      → OpenAI Images API (gpt-image-1) — the direct path.
//   • OPENROUTER_API_KEY  → OpenRouter /v1/chat/completions (modalities:["image"])
//                           — one key, flips GPT-Image / Flux / Gemini per model.
// If both are set, OpenAI is used (set AR_IMAGE_PROVIDER=openrouter to override).
//
// Usage:
//   node scripts/image-gen.mjs --subject "a Seoul atelier seam" --kind inline --out /tmp/x.png
// kind: hero | inline | portrait | square  (drives aspect ratio)

import fs from 'node:fs';
import { buildPrompt } from './image-prompt.mjs';

// OpenAI gpt-image-1 supported sizes → our aspect kinds.
const OPENAI_SIZE = {
	hero: '1536x1024', // 16:9-ish landscape
	inline: '1536x1024', // 3:2 landscape
	portrait: '1024x1536', // 4:5 portrait
	square: '1024x1024', // 1:1
};

const OPENROUTER_MODELS = {
	hero: process.env.AR_MODEL_HERO || 'openai/gpt-image-1',
	inline: process.env.AR_MODEL_INLINE || 'google/gemini-2.5-flash-image',
	bulk: process.env.AR_MODEL_BULK || 'black-forest-labs/flux-2-klein',
};

function chooseProvider() {
	const override = process.env.AR_IMAGE_PROVIDER;
	if (override === 'openai' && process.env.OPENAI_API_KEY) return 'openai';
	if (override === 'openrouter' && process.env.OPENROUTER_API_KEY) return 'openrouter';
	if (process.env.OPENAI_API_KEY) return 'openai';
	if (process.env.OPENROUTER_API_KEY) return 'openrouter';
	return null;
}

/** OpenAI Images API → base64 PNG. */
async function viaOpenAI(prompt, kind, out) {
	const res = await fetch('https://api.openai.com/v1/images/generations', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			model: process.env.AR_OPENAI_IMAGE_MODEL || 'gpt-image-1',
			prompt,
			size: OPENAI_SIZE[kind] ?? OPENAI_SIZE.inline,
			n: 1,
		}),
	});
	if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
	const data = await res.json();
	const b64 = data?.data?.[0]?.b64_json;
	if (!b64) throw new Error('OpenAI returned no image (check key / model access).');
	fs.writeFileSync(out, Buffer.from(b64, 'base64'));
	return out;
}

/** OpenRouter chat/completions with image modality → data-URL image. */
async function viaOpenRouter(prompt, kind, model, out) {
	const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
			'Content-Type': 'application/json',
			'HTTP-Referer': 'https://arahkaii.com',
			'X-Title': 'Arahkaii',
		},
		body: JSON.stringify({
			model: model || OPENROUTER_MODELS[kind === 'hero' ? 'hero' : 'inline'],
			modalities: ['image', 'text'],
			messages: [{ role: 'user', content: prompt }],
		}),
	});
	if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
	const data = await res.json();
	const url = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
	if (!url) throw new Error('OpenRouter returned no image; check model + response shape.');
	fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64'));
	return out;
}

/**
 * Generate one image to a local file. Returns the output path.
 * @param {{subject:string, kind?:'hero'|'inline'|'portrait'|'square', model?:string, extra?:string, out:string}} o
 */
export async function generateImage(o) {
	const provider = chooseProvider();
	if (!provider) {
		throw new Error(
			'No image key set. Add OPENAI_API_KEY (or OPENROUTER_API_KEY) to .env, ' +
				'or source a real image via Firecrawl instead (see /publish).',
		);
	}
	const kind = o.kind ?? 'inline';
	const prompt = buildPrompt(o.subject, { kind, extra: o.extra });
	return provider === 'openai'
		? viaOpenAI(prompt, kind, o.out)
		: viaOpenRouter(prompt, kind, o.model, o.out);
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
	const a = process.argv.slice(2);
	const get = (k) => {
		const i = a.indexOf(`--${k}`);
		return i >= 0 ? a[i + 1] : undefined;
	};
	generateImage({
		subject: get('subject'),
		kind: get('kind'),
		model: get('model'),
		extra: get('extra'),
		out: get('out') || '/tmp/arahkaii-gen.png',
	})
		.then((p) => console.log(`✓ ${p} (provider: ${chooseProvider()})`))
		.catch((e) => {
			console.error(`✗ ${e.message}`);
			process.exit(1);
		});
}
