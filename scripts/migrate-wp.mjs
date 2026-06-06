// One-shot WordPress → Astro content migration.
//   node scripts/migrate-wp.mjs
// Reads wp-import/posts/**/index.md, normalises to the Zod schema, copies
// images to src/assets/images/archive/<slug>/, writes src/content/posts/<year>/<slug>.md,
// and prints a review table. Throwaway tool (not the publish automation).

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'wp-import/posts');
const OUT = path.join(ROOT, 'src/content/posts');
const ARCHIVE = path.join(ROOT, 'src/assets/images/archive');
const PLACEHOLDER_REL = '../../../assets/blog-placeholder-1.jpg';
const TODAY = '2026-06-06';

const CAT_MAP = {
	fashion: 'style',
	culture: 'culture',
	guides: 'guides',
	living: 'living',
	travel: 'travel',
	people: 'people',
	dining: 'dining',
};
// Specific editorial sections win over the broad style/culture buckets; for a
// fashion piece dual-tagged culture+fashion, style wins (see FORCE_CULTURE).
const PRIORITY = ['guides', 'dining', 'travel', 'people', 'living', 'style', 'culture'];

// Genuinely cultural pieces that are dual-tagged culture+fashion — keep culture.
const FORCE_CULTURE = new Set([
	'batik-blockchain-indonesia-textile-authenticity-technology',
	'kendrick-lamar-super-bowl-jeans-2-3-million-media-value',
]);

// Duplicate drafts of published posts — skip entirely (user decision).
const DROP = new Set([
	'the-rise-of-modest-streetwear-southeast-asia-redefining-muslim-fashion-2',
	'id-1506',
	'the-southeast-asian-foundation-guide-finding-your-perfect-shade',
]);

const SLUG_OVERRIDES = {
	'id-1366': 'capsule-wardrobe-guide-2026',
};
const NO_LEGACY = new Set(['id-1366']);

// ---- helpers ---------------------------------------------------------------
const walk = (dir) =>
	fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
		const p = path.join(dir, e.name);
		return e.isDirectory() ? walk(p) : p;
	});

const yamlStr = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

const stripMd = (s) =>
	s
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → text
		.replace(/[*_`#>]/g, '') // emphasis/heading/quote/code marks
		.replace(/\s+/g, ' ')
		.trim();

function firstParagraph(body) {
	const blocks = body.split(/\n\s*\n/);
	for (const raw of blocks) {
		const b = raw.trim();
		if (!b) continue;
		// skip structural blocks: hr, headings, blockquotes, lists, images, tables, fences
		if (/^([*\-_]\s*){3,}$/.test(b)) continue; // * * *  /  ---
		if (/^(#|>|\||```|!\[|[-*+]\s|\d+\.\s)/.test(b)) continue;
		const text = stripMd(b);
		if (text.split(/\s+/).length >= 8) return text;
	}
	// fallback: first non-empty stripped block
	for (const raw of blocks) {
		const t = stripMd(raw);
		if (t) return t;
	}
	return '';
}

function makeStandfirst(body) {
	const para = firstParagraph(body);
	if (!para) return '';
	// Build from whole sentences: stop once we have a substantial one
	// (≥15 words), grow to ≥25 if the opener is short, never exceed ~40.
	// Protect decimals/abbreviations (e.g. $2.99) from the sentence splitter.
	const PROT = '';
	const safe = para.replace(/(\d)\.(\d)/g, `$1${PROT}$2`);
	const sentences = (safe.match(/[^.!?]+[.!?]+/g) || [safe]).map((s) =>
		s.split(PROT).join('.'),
	);
	const wc = (s) => s.trim().split(/\s+/).length;
	let out = '';
	for (const s of sentences) {
		const cand = (out ? `${out} ${s.trim()}` : s.trim()).replace(/\s+/g, ' ');
		if (!out) {
			out = cand;
			if (wc(cand) >= 15) break;
		} else if (wc(cand) <= 40) {
			out = cand;
			if (wc(cand) >= 25) break;
		} else break;
	}
	out = out.trim();
	if (out.length > 218) out = `${out.slice(0, 215).replace(/\s+\S*$/, '')}…`;
	return out;
}

function rawDate(d) {
	if (!d) return null;
	if (d instanceof Date) return d.toISOString().slice(0, 10);
	return String(d).slice(0, 10);
}

const copied = new Set();
function copyImages(srcImagesDir, slug) {
	if (!fs.existsSync(srcImagesDir)) return;
	const dest = path.join(ARCHIVE, slug);
	fs.mkdirSync(dest, { recursive: true });
	for (const f of fs.readdirSync(srcImagesDir)) {
		const sp = path.join(srcImagesDir, f);
		if (fs.statSync(sp).isFile()) {
			fs.copyFileSync(sp, path.join(dest, f));
			copied.add(`${slug}/${f}`);
		}
	}
}

// ---- main ------------------------------------------------------------------
const indexFiles = walk(SRC).filter((p) => path.basename(p) === 'index.md');
const rows = [];
const flags = { missingHero: [], droppedInline: [], unknownCat: [] };

for (const file of indexFiles) {
	const dir = path.dirname(file);
	const imagesDir = path.join(dir, 'images');
	const folder = path.basename(dir);
	const rawSlug = folder.replace(/^\d{4}-\d{2}-\d{2}-/, '');
	if (DROP.has(rawSlug)) continue; // duplicate draft — skip
	const slug = SLUG_OVERRIDES[rawSlug] ?? rawSlug;

	const { data, content } = matter(fs.readFileSync(file, 'utf8'));

	// category
	const wpCats = Array.isArray(data.categories) ? data.categories : [];
	const mapped = wpCats.map((c) => CAT_MAP[String(c).toLowerCase()] ?? null).filter(Boolean);
	if (wpCats.length && !mapped.length) flags.unknownCat.push(`${slug}: ${wpCats.join(',')}`);
	let category = PRIORITY.find((p) => mapped.includes(p)) ?? 'style';
	if (FORCE_CULTURE.has(slug)) category = 'culture';

	// date / year / draft
	const dstr = rawDate(data.date);
	let draft = data.draft === true;
	let date = dstr;
	if (!date) {
		date = TODAY;
		draft = true;
	}
	const year = date.slice(0, 4);

	// images: copy, then resolve hero + rewrite inline
	copyImages(imagesDir, slug);
	const archiveRel = (f) => `../../../assets/images/archive/${slug}/${f}`;
	const onDisk = (f) => fs.existsSync(path.join(imagesDir, f));

	let body = content;
	let droppedInline = 0;
	body = body.replace(/!\[([^\]]*)\]\(images\/([^)]+)\)/g, (m, alt, f) => {
		if (onDisk(f)) return `![${alt}](${archiveRel(f)})`;
		droppedInline++;
		return '';
	});
	if (droppedInline) flags.droppedInline.push(`${slug} (${droppedInline})`);

	// hero
	let heroRel = null;
	let imageStatus = 'cover';
	const cover = data.coverImage ? String(data.coverImage) : null;
	if (cover && onDisk(cover)) {
		heroRel = archiveRel(cover);
	} else {
		// promote first surviving inline image
		const m = body.match(/!\[[^\]]*\]\((\.\.\/\.\.\/\.\.\/assets\/images\/archive\/[^)]+)\)/);
		if (m) {
			heroRel = m[1];
			imageStatus = 'promoted-inline';
		} else {
			heroRel = PLACEHOLDER_REL;
			imageStatus = 'PLACEHOLDER';
			draft = true;
			flags.missingHero.push(slug);
		}
	}

	// body cleanup
	body = body
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/\[\/?(caption|gallery)[^\]]*\]/gi, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/\n{3,}/g, '\n\n')
		.trim();

	const standfirst = makeStandfirst(content);
	const tags = Array.isArray(data.tags) ? data.tags : [];

	// frontmatter
	const fm = [];
	fm.push('---');
	fm.push(`title: ${yamlStr(data.title ?? slug)}`);
	fm.push(`standfirst: ${yamlStr(standfirst)}`);
	fm.push(`category: ${category}`);
	if (tags.length) {
		fm.push('tags:');
		for (const t of tags) fm.push(`  - ${yamlStr(t)}`);
	}
	fm.push('author: nadra-nichols');
	fm.push(`date: ${date}`);
	fm.push(`heroImage: ${yamlStr(heroRel)}`);
	fm.push('heroCaption: ""');
	fm.push('heroCredit: "Arahkaii"');
	if (draft) fm.push('draft: true');
	if (!NO_LEGACY.has(rawSlug)) fm.push(`legacyWpSlug: ${yamlStr(rawSlug)}`);
	fm.push('---');

	const outDir = path.join(OUT, year);
	fs.mkdirSync(outDir, { recursive: true });
	fs.writeFileSync(path.join(outDir, `${slug}.md`), `${fm.join('\n')}\n\n${body}\n`);

	rows.push({
		title: String(data.title ?? slug).slice(0, 52),
		wp: wpCats.join('|') || '—',
		category,
		slug,
		year,
		state: draft ? 'draft' : 'published',
		img: imageStatus,
		sfWords: standfirst ? standfirst.split(/\s+/).length : 0,
	});
}

// ---- report ----------------------------------------------------------------
rows.sort((a, b) => (a.state + a.year + a.slug).localeCompare(b.state + b.year + b.slug));
const pad = (s, n) => String(s).padEnd(n).slice(0, n);
console.log(
	'\n' +
		pad('TITLE', 53) +
		pad('WP CATS', 18) +
		pad('→ CATEGORY', 11) +
		pad('YEAR', 5) +
		pad('STATE', 10) +
		pad('IMAGE', 16) +
		'SLUG',
);
console.log('-'.repeat(150));
for (const r of rows) {
	console.log(
		pad(r.title, 53) +
			pad(r.wp, 18) +
			pad(r.category, 11) +
			pad(r.year, 5) +
			pad(r.state, 10) +
			pad(r.img, 16) +
			r.slug,
	);
}
const pub = rows.filter((r) => r.state === 'published').length;
console.log('-'.repeat(150));
console.log(`TOTAL ${rows.length}  ·  published ${pub}  ·  draft ${rows.length - pub}  ·  images copied ${copied.size}`);
console.log('\nFLAGS');
console.log('  placeholder hero (generate later):', flags.missingHero.join(', ') || 'none');
console.log('  posts with dropped inline images :', flags.droppedInline.join(', ') || 'none');
console.log('  unmapped categories              :', flags.unknownCat.join(', ') || 'none');

// CSV for reference
const csv = ['title,wp_cats,category,slug,year,state,image,standfirst_words'];
for (const r of rows)
	csv.push(
		[r.title, r.wp, r.category, r.slug, r.year, r.state, r.img, r.sfWords]
			.map((v) => `"${String(v).replace(/"/g, '""')}"`)
			.join(','),
	);
fs.writeFileSync('/tmp/arahkaii-migration.csv', csv.join('\n'));
console.log('\nCSV → /tmp/arahkaii-migration.csv');
