// new-post.mjs — the deterministic half of `/publish`.
// Writes a schema-valid post into src/content/posts/<year>/<slug>.mdx, places
// the hero image into src/assets/images/<slug>/ (local-first), and validates
// the frontmatter against the Zod schema's rules before writing. Claude writes
// the body + standfirst; this guarantees the file is correct and committable.
//
// Usage:
//   node scripts/new-post.mjs \
//     --title "The quiet renaissance of Korean heritage brands" \
//     --category style --author nadra-nichols \
//     --standfirst "How a generation of Seoul ateliers learned to whisper." \
//     --tags "Fashion,Heritage" \
//     --hero /abs/path/to/cover.jpg \
//     --hero-caption "Wooyoungmi FW26 backstage." \
//     --hero-credit "Courtesy of the brand" \
//     --body /abs/path/to/body.mdx   # (MDX/markdown body; or --body-stdin)
//     [--slug custom-slug] [--date 2026-06-06] [--draft] [--dry-run]
//
// Notes:
//  - credit is REQUIRED (magazine discipline). Sourced images must carry a real
//    credit + a logged licence decision (see .claude/commands/publish.md).
//  - For sourced images, default the credit to "Courtesy of <name>" or the
//    photographer; never commit an uncredited image.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const POSTS = path.join(ROOT, 'src/content/posts');
const AUTHORS = path.join(ROOT, 'src/content/authors');
const IMAGES = path.join(ROOT, 'src/assets/images');
const CATEGORIES = ['style', 'beauty', 'dining', 'travel', 'culture', 'living', 'people', 'guides'];

// ---- arg parsing -----------------------------------------------------------
const args = process.argv.slice(2);
const flags = {};
for (let i = 0; i < args.length; i++) {
	const a = args[i];
	if (a.startsWith('--')) {
		const key = a.slice(2);
		const next = args[i + 1];
		if (next === undefined || next.startsWith('--')) flags[key] = true;
		else {
			flags[key] = next;
			i++;
		}
	}
}

const die = (msg) => {
	console.error(`✗ ${msg}`);
	process.exit(1);
};

const slugify = (s) =>
	s
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[''']/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);

const yamlStr = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

// ---- validate --------------------------------------------------------------
const title = flags.title;
if (!title || title === true) die('--title is required');
if (title.length > 110) die(`title is ${title.length} chars (max 110)`);

const category = String(flags.category || '').toLowerCase();
if (!CATEGORIES.includes(category))
	die(`--category must be one of: ${CATEGORIES.join(', ')} (got "${flags.category}")`);

const author = String(flags.author || '');
if (!author) die('--author is required (an id in src/content/authors/)');
if (!fs.existsSync(path.join(AUTHORS, `${author}.md`)))
	die(`unknown author "${author}" — create src/content/authors/${author}.md first`);

const standfirst = flags.standfirst;
if (!standfirst || standfirst === true) die('--standfirst is required');
if (standfirst.length > 220) die(`standfirst is ${standfirst.length} chars (max 220)`);

const heroCredit = flags['hero-credit'];
if (!heroCredit || heroCredit === true)
	die('--hero-credit is required (magazine discipline — never commit an uncredited image)');
const heroCaption = flags['hero-caption'] && flags['hero-caption'] !== true ? flags['hero-caption'] : '';

const heroSrc = flags.hero;
if (!heroSrc || heroSrc === true) die('--hero <path-to-image-file> is required');
if (!fs.existsSync(heroSrc)) die(`hero image not found: ${heroSrc}`);

const date = flags.date && flags.date !== true ? String(flags.date) : new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) die(`--date must be YYYY-MM-DD (got "${date}")`);
const year = date.slice(0, 4);

const slug = flags.slug && flags.slug !== true ? String(flags.slug) : slugify(title);
const tags = flags.tags && flags.tags !== true ? String(flags.tags).split(',').map((t) => t.trim()).filter(Boolean) : [];
const draft = !!flags.draft;
const dryRun = !!flags['dry-run'];

// body
let body = '';
if (flags['body-stdin']) body = fs.readFileSync(0, 'utf8');
else if (flags.body && flags.body !== true) {
	if (!fs.existsSync(flags.body)) die(`body file not found: ${flags.body}`);
	body = fs.readFileSync(flags.body, 'utf8');
}
body = body.trim();
if (!body) die('a body is required (--body <file> or --body-stdin)');

// collision check
// Always .mdx: one extension across the AI pipeline, Keystatic and the loader,
// so every post is editable in the CMS and can carry MDX components.
const ext = 'mdx';
const outPath = path.join(POSTS, year, `${slug}.${ext}`);
const altPath = path.join(POSTS, year, `${slug}.${ext === 'mdx' ? 'md' : 'mdx'}`);
if (!dryRun && (fs.existsSync(outPath) || fs.existsSync(altPath)))
	die(`a post with slug "${slug}" already exists in ${year}/`);

// ---- place hero image (local-first) ---------------------------------------
const heroFile = path.basename(heroSrc);
const heroRel = `../../../assets/images/${slug}/${heroFile}`;
if (!dryRun) {
	fs.mkdirSync(path.join(IMAGES, slug), { recursive: true });
	fs.copyFileSync(heroSrc, path.join(IMAGES, slug, heroFile));
}

// ---- assemble frontmatter --------------------------------------------------
const fm = ['---'];
fm.push(`title: ${yamlStr(title)}`);
fm.push(`standfirst: ${yamlStr(standfirst)}`);
fm.push(`category: ${category}`);
if (tags.length) {
	fm.push('tags:');
	for (const t of tags) fm.push(`  - ${yamlStr(t)}`);
}
fm.push(`author: ${author}`);
fm.push(`date: ${date}`);
if (flags['seo-title'] && flags['seo-title'] !== true) {
	if (String(flags['seo-title']).length > 70) die('--seo-title exceeds 70 chars');
	fm.push(`seoTitle: ${yamlStr(flags['seo-title'])}`);
}
if (flags['meta-description'] && flags['meta-description'] !== true) {
	if (String(flags['meta-description']).length > 160) die('--meta-description exceeds 160 chars');
	fm.push(`metaDescription: ${yamlStr(flags['meta-description'])}`);
}
fm.push(`heroImage: ${yamlStr(heroRel)}`);
fm.push(`heroCaption: ${yamlStr(heroCaption)}`);
fm.push(`heroCredit: ${yamlStr(heroCredit)}`);
if (draft) fm.push('draft: true');
// Raw-YAML splice for structured-data fields (faq / howTo / listItems …).
// The routine writes valid YAML lines to this file; we insert them verbatim.
if (flags['fm-extra'] && flags['fm-extra'] !== true) {
	if (!fs.existsSync(flags['fm-extra'])) die(`--fm-extra file not found: ${flags['fm-extra']}`);
	const extra = fs.readFileSync(flags['fm-extra'], 'utf8').replace(/\s+$/, '');
	if (extra) fm.push(extra);
}
fm.push('---');
const file = `${fm.join('\n')}\n\n${body}\n`;

if (dryRun) {
	console.log(`# DRY RUN → ${path.relative(ROOT, outPath)}`);
	console.log(`# hero → src/assets/images/${slug}/${heroFile}`);
	console.log('\n' + file);
	process.exit(0);
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, file);
console.log(`✓ wrote ${path.relative(ROOT, outPath)}`);
console.log(`✓ hero  src/assets/images/${slug}/${heroFile}`);
console.log(`\nNext: npm run build  (schema gate)  →  review  →  git commit`);
console.log(`URL on deploy: /${category}/${slug}/`);
