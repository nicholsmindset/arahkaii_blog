// Post-build release checks shared by local development and GitHub Actions.
// Fails on broken internal links or invalid page-level heading/landmark counts.
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');

if (!fs.existsSync(DIST)) {
	console.error('dist/ is missing. Run `npm run build` first.');
	process.exit(1);
}

const htmlFiles = [];
function walk(dir) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const file = path.join(dir, entry.name);
		if (entry.isDirectory()) walk(file);
		else if (entry.name.endsWith('.html')) htmlFiles.push(file);
	}
}
walk(DIST);

const semanticFailures = [];
const missingTargets = new Map();

function targetExists(href) {
	const relative = href.replace(/^\//, '');
	return [
		path.join(DIST, relative, 'index.html'),
		path.join(DIST, relative),
		path.join(DIST, `${relative}.html`),
	].some(fs.existsSync);
}

for (const file of htmlFiles) {
	const html = fs.readFileSync(file, 'utf8');
	const relativeFile = path.relative(DIST, file);
	const h1Count = (html.match(/<h1\b/g) ?? []).length;
	const mainCount = (html.match(/<main\b/g) ?? []).length;

	if (h1Count !== 1 || mainCount !== 1) {
		semanticFailures.push({ file: relativeFile, h1Count, mainCount });
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

if (semanticFailures.length || missingTargets.size) process.exit(1);

console.log(
	`✓ ${htmlFiles.length} HTML pages checked · one h1/main each · all internal links resolve.`,
);
