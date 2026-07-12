// illustrate-post.mjs — auto-illustrate a draft: generate the hero + one image
// per H2 via OpenRouter and inject <Figure> blocks so the post builds fully
// illustrated. The deterministic engine behind /illustrate.
//
// Usage:
//   node scripts/illustrate-post.mjs --post <slug|path> \
//     [--hero] [--sections all|none|1,3,4] [--density per-h2|every-other|hero-only] \
//     [--credit "Arahkaii"] [--subjects "0=hero subj;2=section subj"] \
//     [--max-images N] [--concurrency 2] [--force] [--dry-run] [--only-prompts]
//
// --only-prompts : print prompts + models, no API calls, no writes (free).
// --dry-run      : print the full plan + planned edits, no API calls, no writes.
// Real runs need OPENROUTER_API_KEY (or OPENAI_API_KEY). `npm run build` needs no key.

import './load-env.mjs'; // must be first — loads .env before image-gen evaluates
import fs from 'node:fs';
import path from 'node:path';
import { generateImage, hasImageKey, ROUTE_MODELS } from './image-gen.mjs';
import { buildPlan, routeModel, injectFigures, figureBlock } from './illustrate-plan.mjs';

const ROOT = process.cwd();
const POSTS = path.join(ROOT, 'src/content/posts');

// ---- arg parsing (same shape as new-post.mjs) ------------------------------
const args = process.argv.slice(2);
const flags = {};
for (let i = 0; i < args.length; i++) {
	const a = args[i];
	if (!a.startsWith('--')) continue;
	const key = a.slice(2);
	const next = args[i + 1];
	if (next === undefined || next.startsWith('--')) flags[key] = true;
	else {
		flags[key] = next;
		i++;
	}
}
const die = (m) => {
	console.error(`✗ ${m}`);
	process.exit(1);
};
const val = (k) => (flags[k] && flags[k] !== true ? String(flags[k]) : undefined);

// ---- resolve the post ------------------------------------------------------
const postArg = val('post');
if (!postArg) die('--post <slug|path> is required');

function resolvePost(arg) {
	if (arg.includes('/') || arg.endsWith('.md') || arg.endsWith('.mdx')) {
		const p = path.isAbsolute(arg) ? arg : path.join(ROOT, arg);
		if (fs.existsSync(p)) return p;
		die(`post not found: ${arg}`);
	}
	// bare slug → search src/content/posts/**/<slug>.{md,mdx}
	for (const year of fs.readdirSync(POSTS)) {
		const dir = path.join(POSTS, year);
		if (!fs.statSync(dir).isDirectory()) continue;
		for (const ext of ['mdx', 'md']) {
			const p = path.join(dir, `${arg}.${ext}`);
			if (fs.existsSync(p)) return p;
		}
	}
	die(`no post with slug "${arg}" under src/content/posts/`);
}

const postPath = resolvePost(postArg);
const ext = path.extname(postPath).slice(1); // 'md' | 'mdx'
const slug = path.basename(postPath, path.extname(postPath));

// ---- read + split frontmatter / body (string-preserving) -------------------
const raw = fs.readFileSync(postPath, 'utf8');
const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
if (!fmMatch) die(`no frontmatter block in ${path.relative(ROOT, postPath)}`);
const fmBlock = fmMatch[1];
let body = raw.slice(fmMatch[0].length);

const fmGet = (key) => {
	const m = fmBlock.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
	if (!m) return undefined;
	return m[1].trim().replace(/^["']|["']$/g, '');
};
const frontmatter = {
	category: fmGet('category'),
	title: fmGet('title'),
	standfirst: fmGet('standfirst'),
};

// ---- build the plan --------------------------------------------------------
function parseSubjects(s) {
	const out = {};
	if (!s) return out;
	for (const pair of String(s).split(';')) {
		const eq = pair.indexOf('=');
		if (eq < 0) continue;
		const idx = parseInt(pair.slice(0, eq).trim(), 10);
		const text = pair.slice(eq + 1).trim();
		if (Number.isInteger(idx) && text) out[idx] = text;
	}
	return out;
}

const opts = {
	pillar: val('pillar'),
	sections: val('sections') || 'all',
	density: val('density') || 'per-h2',
	hero: !!flags.hero,
	credit: val('credit') || process.env.AR_GEN_CREDIT || 'Arahkaii',
	subjects: parseSubjects(val('subjects')),
	heroSubject: val('hero-subject'),
};

const plan = buildPlan(frontmatter, body, slug, opts);
let queue = [];
if (plan.hero) queue.push(plan.hero);
queue.push(...plan.sections);
queue.forEach((p) => (p.model = routeModel(p)));

const maxImages = val('max-images') ? parseInt(val('max-images'), 10) : Infinity;
if (queue.length > maxImages) {
	console.log(`ℹ capping at --max-images ${maxImages} (of ${queue.length} planned)`);
	queue = queue.slice(0, maxImages);
}

const pillar = (opts.pillar || frontmatter.category || 'guides').toLowerCase();
console.log(`\n📷 illustrate "${slug}"  ·  pillar: ${pillar}  ·  ${queue.length} image(s)`);
console.log(`   models → text:${ROUTE_MODELS.text}  mood:${ROUTE_MODELS.mood}\n`);

// ---- --only-prompts : print and exit (free) --------------------------------
if (flags['only-prompts']) {
	for (const p of queue) {
		console.log(`── ${p.kind === 'hero' ? 'HERO' : `H2 #${p.ordinal}`}  [${p.templateId}]  → ${p.model}`);
		if (p.heading) console.log(`   heading: ${p.heading}`);
		console.log(`   out: ${p.outFile}`);
		console.log(`   ${p.prompt}\n`);
	}
	process.exit(0);
}

// ---- --dry-run : print plan + planned edits, no writes ----------------------
if (flags['dry-run']) {
	const willInjectComponents = plan.sections.length > 0;
	const targetPath =
		willInjectComponents && ext === 'md' ? postPath.replace(/\.md$/, '.mdx') : postPath;
	console.log('# DRY RUN — no images generated, no files written\n');
	if (plan.hero) console.log(`hero → ${plan.hero.outFile}  (frontmatter heroImage rewritten)`);
	for (const p of plan.sections) {
		console.log(`\nH2 #${p.ordinal} "${p.heading}"  [${p.templateId}] → ${p.model}`);
		console.log(`  image  : ${p.outFile}`);
		console.log(`  import : import ${p.importIdent} from '${p.importPath}';`);
		console.log(`  inject :\n${figureBlock(p).split('\n').map((l) => '    ' + l).join('\n')}`);
	}
	if (ext === 'md' && willInjectComponents)
		console.log(`\nrename: ${path.relative(ROOT, postPath)} → ${path.relative(ROOT, targetPath)}`);
	console.log(`\nbuild gate: npx astro check && npm run build`);
	process.exit(0);
}

// ---- real run --------------------------------------------------------------
const force = !!flags.force;

// Only an actual generation needs an API key. If every image already exists on
// disk (re-inject / re-build pass), proceed key-free.
const needsGen = queue.some((p) => force || !fs.existsSync(path.join(ROOT, p.outFile)));
if (needsGen && !hasImageKey())
	die(
		'No image key set. Add OPENROUTER_API_KEY to .env (or source via Firecrawl). ' +
			'Tip: --only-prompts / --dry-run need no key.',
	);

const concurrency = val('concurrency') ? Math.max(1, parseInt(val('concurrency'), 10)) : 2;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generateOne(p) {
	if (!force && fs.existsSync(path.join(ROOT, p.outFile))) return { ...p, skipped: true };
	fs.mkdirSync(path.join(ROOT, path.dirname(p.outFile)), { recursive: true });
	let lastErr;
	for (let attempt = 1; attempt <= 3; attempt++) {
		try {
			await generateImage({ prompt: p.prompt, kind: p.kind, model: p.model, out: path.join(ROOT, p.outFile) });
			return { ...p, ok: true };
		} catch (e) {
			lastErr = e;
			if (/\b(429|5\d\d)\b/.test(e.message) && attempt < 3) {
				await sleep(attempt * 1500);
				continue;
			}
			break;
		}
	}
	return { ...p, error: lastErr?.message || 'unknown error' };
}

async function runBatch(plans) {
	const results = [];
	const work = [...plans];
	async function worker() {
		while (work.length) results.push(await generateOne(work.shift()));
	}
	await Promise.all(Array.from({ length: concurrency }, worker));
	return results;
}

const results = await runBatch(queue);
for (const r of results) {
	const tag = r.ok ? '✓ generated' : r.skipped ? '· exists' : '✗ FAILED';
	console.log(`${tag}  ${r.outFile}${r.error ? `  — ${r.error}` : ''}`);
}

// Sections whose image exists on disk (generated or already present) get a Figure.
const okSections = plan.sections.filter((p) => {
	const r = results.find((x) => x.outFile === p.outFile);
	return r && (r.ok || r.skipped);
});

let newBody = body;
if (okSections.length) newBody = injectFigures(body, okSections);

// Hero: rewrite frontmatter heroImage/heroCredit (+ caption if empty).
let newFm = fmBlock;
const heroResult = plan.hero && results.find((x) => x.outFile === plan.hero.outFile);
if (plan.hero && heroResult && (heroResult.ok || heroResult.skipped)) {
	newFm = setFm(newFm, 'heroImage', plan.hero.importPath);
	newFm = setFm(newFm, 'heroCredit', opts.credit);
	const existingCaption = fmGet('heroCaption');
	if (!existingCaption)
		newFm = setFm(newFm, 'heroCaption', frontmatter.standfirst || frontmatter.title || '');
}

function setFm(block, key, value) {
	const yaml = `${key}: ${JSON.stringify(String(value))}`;
	const re = new RegExp(`^${key}:.*$`, 'm');
	return re.test(block) ? block.replace(re, yaml) : block + `\n${yaml}`;
}

const changed = okSections.length > 0 || newFm !== fmBlock;
if (!changed) {
	console.log('\nNothing to write (no successful images / no frontmatter change).');
	process.exit(results.some((r) => r.error) ? 1 : 0);
}

// Flip .md → .mdx when injecting components; guard against collision.
const flipToMdx = okSections.length > 0 && ext === 'md';
const targetPath = flipToMdx ? postPath.replace(/\.md$/, '.mdx') : postPath;
if (flipToMdx && fs.existsSync(targetPath)) die(`cannot flip to .mdx — ${path.relative(ROOT, targetPath)} already exists`);

const fileOut = `---\n${newFm}\n---\n${newBody.startsWith('\n') ? '' : '\n'}${newBody}`;
fs.writeFileSync(targetPath, fileOut);
if (flipToMdx) fs.rmSync(postPath);

console.log(`\n✓ wrote ${path.relative(ROOT, targetPath)}${flipToMdx ? '  (renamed .md → .mdx)' : ''}`);
console.log(`Next: npx astro check && npm run build   (the build is the gate)`);
if (results.some((r) => r.error)) {
	console.log('⚠ some images failed — their sections were left without a <Figure>. Re-run with --force to retry.');
	process.exit(1);
}
