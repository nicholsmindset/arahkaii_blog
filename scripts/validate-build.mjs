// Post-build release checks shared by local development and GitHub Actions.
// Fails on broken internal links or invalid page-level heading/landmark counts.
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');

if (!fs.existsSync(DIST)) {
	console.error('dist/ is missing. Run `npm run build` first.');
	process.exit(1);
}

// Server adapters such as Vercel place public output in dist/client, while
// fully static builds write it directly to dist.
const PUBLIC_ROOT = fs.existsSync(path.join(DIST, 'client'))
	? path.join(DIST, 'client')
	: DIST;

const htmlFiles = [];
function walk(dir) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const file = path.join(dir, entry.name);
		if (entry.isDirectory()) walk(file);
		else if (entry.name.endsWith('.html')) htmlFiles.push(file);
	}
}
walk(PUBLIC_ROOT);

const semanticFailures = [];
const hierarchyFailures = [];
const imageFailures = [];
const missingTargets = new Map();

function targetExists(href) {
	const relative = href.replace(/^\//, '');
	return [
		path.join(PUBLIC_ROOT, relative, 'index.html'),
		path.join(PUBLIC_ROOT, relative),
		path.join(PUBLIC_ROOT, `${relative}.html`),
	].some(fs.existsSync);
}

for (const file of htmlFiles) {
	const html = fs.readFileSync(file, 'utf8');
	const relativeFile = path.relative(PUBLIC_ROOT, file);
	const h1Count = (html.match(/<h1\b/g) ?? []).length;
	const mainCount = (html.match(/<main\b/g) ?? []).length;

	if (h1Count !== 1 || mainCount !== 1) {
		semanticFailures.push({ file: relativeFile, h1Count, mainCount });
	}

	const mainHtml = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
	const levels = [...mainHtml.matchAll(/<h([1-6])\b/g)].map((match) => Number(match[1]));
	for (let i = 1; i < levels.length; i++) {
		if (levels[i] > levels[i - 1] + 1) {
			hierarchyFailures.push(`${relativeFile}: heading jumps h${levels[i - 1]} → h${levels[i]}`);
			break;
		}
	}

	const articleHtml = mainHtml.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1] ?? '';
	for (const image of articleHtml.matchAll(/<img\b([^>]*)>/g)) {
		if (!/\bwidth="\d+"/.test(image[1]) || !/\bheight="\d+"/.test(image[1])) {
			imageFailures.push(`${relativeFile}: article image missing explicit width/height`);
			break;
		}
	}

	for (const match of html.matchAll(/href="([^"]+)"/g)) {
		const rawHref = match[1];
		if (!rawHref.startsWith('/') || rawHref.startsWith('//')) continue;
		const href = rawHref.split(/[?#]/)[0];
		if (!href || targetExists(href)) continue;
		const sources = missingTargets.get(href) ?? [];
		if (sources.length < 3) sources.push(relativeFile);
		missingTargets.set(href, sources);
	}
}

if (semanticFailures.length) {
	console.error('\nPages must contain exactly one <h1> and one <main>:');
	for (const item of semanticFailures) {
		console.error(`- ${item.file}: h1=${item.h1Count}, main=${item.mainCount}`);
	}
}

if (missingTargets.size) {
	console.error('\nMissing internal link targets:');
	for (const [href, sources] of [...missingTargets].sort()) {
		console.error(`- ${href} <- ${sources.join(', ')}`);
	}
}

if (hierarchyFailures.length) {
	console.error('\nHeading hierarchy failures:');
	for (const item of hierarchyFailures) console.error(`- ${item}`);
}

if (imageFailures.length) {
	console.error('\nArticle image dimension failures:');
	for (const item of imageFailures) console.error(`- ${item}`);
}

if (semanticFailures.length || missingTargets.size || hierarchyFailures.length || imageFailures.length) process.exit(1);

console.log(
	`✓ ${htmlFiles.length} HTML pages checked · headings, landmarks, article images and internal links validated.`,
);
