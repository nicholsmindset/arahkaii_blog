// illustrate-plan.mjs — pure planning for the illustrate pipeline (no I/O, no
// secrets, no network). Parses H2s, builds the per-image plan, routes models,
// assembles prompts, and injects <Figure> blocks. Unit-testable in isolation.

import { ANTI_SLOP, TEMPLATES, getTemplate, PILLARS } from './image-templates.mjs';
import { figureRatio } from './image-prompt.mjs';

// Same slug rules as new-post.mjs (kept in sync deliberately).
export const slugify = (s) =>
	String(s)
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[''']/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 60);

/**
 * Parse top-level H2 (`## …`) headings from MDX/markdown body.
 * Skips `###`+ subheads and anything inside fenced code blocks.
 * @returns {{text:string, lineStart:number, lineEnd:number, ordinal:number}[]}
 */
export function parseH2s(body) {
	const out = [];
	let inFence = false;
	let offset = 0;
	let ordinal = 0;
	for (const line of body.split('\n')) {
		const lineStart = offset;
		const lineEnd = offset + line.length; // index of the trailing '\n'
		offset = lineEnd + 1;
		const fence = line.match(/^\s*(```|~~~)/);
		if (fence) {
			inFence = !inFence;
			continue;
		}
		if (inFence) continue;
		const m = line.match(/^##\s+(?!#)(.+?)\s*$/);
		if (m) out.push({ text: m[1], lineStart, lineEnd, ordinal: ++ordinal });
	}
	return out;
}

/** Distil a heading/title into a concrete-ish image subject (v1 heuristic). */
export function cleanSubject(text) {
	return String(text)
		.replace(/[?:.!]+$/g, '')
		.replace(/^(what|why|how|when|where|who)\b[^a-z0-9]*/i, '')
		.replace(/^(the|a|an|to|is|are|makes?)\b\s+/i, '')
		.replace(/^(makes?|buy|buying)\b\s+/i, '')
		.trim() || text;
}

/** Which H2 ordinals to illustrate, given --sections / --density. */
export function selectSections(h2s, { sections = 'all', density = 'per-h2' } = {}) {
	let chosen = h2s;
	if (sections && sections !== 'all') {
		if (sections === 'none') chosen = [];
		else {
			const wanted = new Set(
				String(sections)
					.split(',')
					.map((n) => parseInt(n.trim(), 10))
					.filter((n) => Number.isInteger(n)),
			);
			chosen = h2s.filter((h) => wanted.has(h.ordinal));
		}
	}
	if (density === 'every-other') chosen = chosen.filter((_, i) => i % 2 === 0);
	if (density === 'hero-only') chosen = [];
	return chosen;
}

/** Resolve the pillar from an explicit override or the post category. */
export function resolvePillar(category, override) {
	const p = String(override || category || '').toLowerCase();
	return PILLARS.includes(p) ? p : 'guides';
}

/**
 * Build the full image plan for a post.
 * @param {{category:string, title:string, standfirst?:string}} frontmatter
 * @param {string} body
 * @param {string} slug
 * @param {object} opts  { pillar, sections, density, hero, subjects, heroSubject, credit }
 * @returns {{ hero: object|null, sections: object[], h2s: object[] }}
 */
export function buildPlan(frontmatter, body, slug, opts = {}) {
	const pillar = resolvePillar(frontmatter.category, opts.pillar);
	const tpl = TEMPLATES[pillar];
	const credit = opts.credit || 'Arahkaii';
	const subjects = opts.subjects || {};
	const h2s = parseH2s(body);

	// Hero (only when requested or no hero exists).
	let hero = null;
	if (opts.hero) {
		const subject = opts.heroSubject || subjects[0] || cleanSubject(frontmatter.title || slug);
		hero = mkPlan({
			kind: 'hero',
			pillar,
			templateId: tpl.hero,
			subject,
			slug,
			outName: 'hero.png',
			ordinal: 0,
			credit,
		});
	}

	// One inline image per selected H2, rotating the pillar's two inline templates.
	const chosen = selectSections(h2s, opts);
	const sections = chosen.map((h, i) => {
		const templateId = tpl.inline[i % tpl.inline.length];
		const subject = subjects[h.ordinal] || cleanSubject(h.text);
		const nn = String(h.ordinal).padStart(2, '0');
		return mkPlan({
			kind: 'inline',
			pillar,
			templateId,
			subject,
			slug,
			outName: `section-${nn}-${slugify(h.text)}.png`,
			ordinal: h.ordinal,
			heading: h.text,
			lineEnd: h.lineEnd,
			importIdent: `figSection${nn}`,
			credit,
		});
	});

	return { hero, sections, h2s };
}

function mkPlan(p) {
	const tmpl = getTemplate(p.templateId);
	const figRatio = figureRatio(p.kind);
	return {
		...p,
		human: !!tmpl?.human,
		figureRatio: figRatio,
		outFile: `src/assets/images/${p.slug}/${p.outName}`,
		importPath: `../../../assets/images/${p.slug}/${p.outName}`,
		alt: altText(p.subject, p.heading),
		prompt: assemblePrompt({ ...p }),
	};
}

/** Compose a tasteful, length-bounded alt string. */
function altText(subject, heading) {
	const base = String(subject || heading || '').trim();
	const s = base.charAt(0).toUpperCase() + base.slice(1);
	return s.length > 125 ? s.slice(0, 122).trimEnd() + '…' : s;
}

/** Fill the locked template with the subject and append the anti-slop tail. */
export function assemblePrompt(plan) {
	const tmpl = getTemplate(plan.templateId);
	const scene = tmpl ? tmpl.text(plan.subject) : `Editorial photograph: ${plan.subject}`;
	const safeZone =
		plan.kind === 'hero'
			? 'Primary subject centred in the central safe zone (middle ~60%) so it survives a full-bleed 16:9 crop and tighter mobile crops, generous even negative space around it. 16:9 aspect ratio.'
			: '3:2 aspect ratio.';
	return [scene + '.', safeZone, 'No text, logos, or watermarks.', ANTI_SLOP].join(' ');
}

/** Pick the OpenRouter model for a plan: fidelity tier vs mood tier. */
export function routeModel(plan, env = process.env) {
	const TEXT = env.AR_MODEL_TEXT || 'google/gemini-3-pro-image-preview';
	const MOOD = env.AR_MODEL_MOOD || 'black-forest-labs/flux.2-pro';
	const HERO = env.AR_MODEL_HERO || TEXT;
	if (plan.kind === 'hero') return HERO;
	return plan.human ? TEXT : MOOD;
}

/** The exact <Figure> block injected under an H2 (no leading/trailing blank). */
export function figureBlock(plan) {
	return (
		`<Figure\n` +
		`  src={${plan.importIdent}}\n` +
		`  alt=${JSON.stringify(plan.alt)}\n` +
		`  credit=${JSON.stringify(plan.credit)}\n` +
		`  ratio="${plan.figureRatio}"\n` +
		`/>`
	);
}

const FIGURE_IMPORT = `import Figure from '../../../components/article/Figure.astro';`;

/**
 * Inject the Figure import, per-image asset imports, and a <Figure> under each
 * section heading. Idempotent: skips a section already carrying its <Figure>,
 * and never duplicates an import. Returns the new body string.
 * @param {string} body
 * @param {object[]} sectionPlans  plans whose image generated successfully
 */
export function injectFigures(body, sectionPlans) {
	let out = body;

	// 1) Inject <Figure> blocks bottom-up so earlier offsets stay valid.
	const ordered = [...sectionPlans].sort((a, b) => b.lineEnd - a.lineEnd);
	for (const plan of ordered) {
		if (out.includes(`src={${plan.importIdent}}`)) continue; // already injected
		const insertAt = plan.lineEnd + 1; // just after the heading's newline
		const block = `\n${figureBlock(plan)}\n`;
		out = out.slice(0, insertAt) + block + out.slice(insertAt);
	}

	// 2) Build the import header (Figure + each asset), deduped.
	const importLines = [];
	if (!out.includes(FIGURE_IMPORT)) importLines.push(FIGURE_IMPORT);
	for (const plan of sectionPlans) {
		const line = `import ${plan.importIdent} from '${plan.importPath}';`;
		if (!out.includes(line)) importLines.push(line);
	}
	if (importLines.length) out = importLines.join('\n') + '\n\n' + out;

	return out;
}
