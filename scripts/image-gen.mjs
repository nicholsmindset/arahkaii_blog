// image-gen.mjs — AI image generation via OpenRouter (drop-in, key-gated).
//
// Deferred per the build decision: this is the structure, ready to enable the
// moment OPENROUTER_API_KEY is in your local .env. The flow is intentionally
// abstracted so a model swap (or the native-OpenAI fallback) is one env var.
//
// IMPORTANT (master-plan §5.1): OpenRouter image generation uses
// /v1/chat/completions with `modalities: ["image","text"]` — NOT OpenAI's
// /v1/images/generations endpoint.
//
// Usage (once keyed):
//   node scripts/image-gen.mjs --subject "a Seoul atelier seam" --kind inline --out /tmp/x.png
//
// Models (per plan): hero → GPT Image; inline → Gemini Flash Image; bulk → FLUX.

import fs from 'node:fs';
import { buildPrompt } from './image-prompt.mjs';

const MODELS = {
	hero: process.env.AR_MODEL_HERO || 'openai/gpt-image-1',
	inline: process.env.AR_MODEL_INLINE || 'google/gemini-2.5-flash-image',
	bulk: process.env.AR_MODEL_BULK || 'black-forest-labs/flux-2-klein',
};

/**
 * Generate one image to a local file. Returns the output path.
 * @param {{subject:string, kind?:'hero'|'inline'|'portrait'|'square', model?:string, out:string}} o
 */
export async function generateImage(o) {
	const key = process.env.OPENROUTER_API_KEY;
	if (!key) {
		throw new Error(
			'OPENROUTER_API_KEY not set. Add it to .env to enable AI generation, ' +
				'or source a real image via Firecrawl instead (see /publish).',
		);
	}
	const model = o.model || MODELS[o.kind === 'hero' ? 'hero' : 'inline'];
	const prompt = buildPrompt(o.subject, { kind: o.kind });

	const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${key}`,
			'Content-Type': 'application/json',
			'HTTP-Referer': 'https://arahkaii.com',
			'X-Title': 'Arahkaii',
		},
		body: JSON.stringify({
			model,
			modalities: ['image', 'text'],
			messages: [{ role: 'user', content: prompt }],
		}),
	});
	if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
	const data = await res.json();
	// OpenRouter returns image(s) as data URLs on the message.
	const url = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
	if (!url) throw new Error('No image returned; check model + response shape.');
	const b64 = url.split(',')[1];
	fs.writeFileSync(o.out, Buffer.from(b64, 'base64'));
	return o.out;
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
		out: get('out') || '/tmp/arahkaii-gen.png',
	})
		.then((p) => console.log(`✓ ${p}`))
		.catch((e) => {
			console.error(`✗ ${e.message}`);
			process.exit(1);
		});
}
