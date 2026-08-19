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
const socialImageFailures = [];
const newsletterFeedbackFailures = [];
const redirectingInternalLinks = [];
const shareFeedbackFailures = [];
const overlayStateFailures = [];
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
	// Search Console ownership files are protocol tokens, not rendered pages.
	// They intentionally have no landmarks and do not belong in a sitemap.
	if (/^google[a-z0-9]+\.html$/i.test(relativeFile)) continue;
	const h1Count = (html.match(/<h1\b/g) ?? []).length;
	const mainCount = (html.match(/<main\b/g) ?? []).length;
	const hasSocialImage = /<meta property="og:image" content="[^"]+"/.test(html);

	if (h1Count !== 1 || mainCount !== 1) {
		semanticFailures.push({ file: relativeFile, h1Count, mainCount });
	}
	if (hasSocialImage && !/<meta property="og:image:alt" content="[^"]+"/.test(html)) {
		socialImageFailures.push(`${relativeFile}: Open Graph image missing alt text`);
	}
	if (hasSocialImage && !/<meta name="twitter:image:alt" content="[^"]+"/.test(html)) {
		socialImageFailures.push(`${relativeFile}: Twitter image missing alt text`);
	}
	for (const form of html.matchAll(/<form\b[^>]*class="[^"]*\bjs-news\b[^"]*"[^>]*>([\s\S]*?)<\/form>/g)) {
		if (!/class="[^"]*\bfield-note\b/.test(form[1])) {
			newsletterFeedbackFailures.push(`${relativeFile}: newsletter form has no feedback region`);
		}
	}
	if (/\bdata-share-copy\b/.test(html) && !/<[^>]+\brole="status"[^>]+\bdata-share-status\b/.test(html)) {
		shareFeedbackFailures.push(`${relativeFile}: copy-link control has no live feedback region`);
	}
	if (!/<div class="overlay"[^>]*\binert(?:="")?[^>]*\baria-hidden="true"/.test(html)) {
		overlayStateFailures.push(`${relativeFile}: closed overlay menu is not inert and hidden from assistive technology`);
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
		if (href !== '/' && !href.endsWith('/') && !/\.[a-z0-9]+$/i.test(href)) {
			redirectingInternalLinks.push(`${relativeFile}: ${href}`);
		}
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

if (redirectingInternalLinks.length) {
	console.error('\nInternal page links must point directly to canonical trailing-slash URLs:');
	for (const item of redirectingInternalLinks.slice(0, 50)) console.error(`- ${item}`);
}

if (hierarchyFailures.length) {
	console.error('\nHeading hierarchy failures:');
	for (const item of hierarchyFailures) console.error(`- ${item}`);
}

if (imageFailures.length) {
	console.error('\nArticle image dimension failures:');
	for (const item of imageFailures) console.error(`- ${item}`);
}

if (socialImageFailures.length) {
	console.error('\nSocial image metadata failures:');
	for (const item of socialImageFailures) console.error(`- ${item}`);
}

if (newsletterFeedbackFailures.length) {
	console.error('\nNewsletter feedback failures:');
	for (const item of newsletterFeedbackFailures) console.error(`- ${item}`);
}

if (shareFeedbackFailures.length) {
	console.error('\nShare feedback failures:');
	for (const item of shareFeedbackFailures) console.error(`- ${item}`);
}

if (overlayStateFailures.length) {
	console.error('\nOverlay menu state failures:');
	for (const item of overlayStateFailures) console.error(`- ${item}`);
}

// ── Sitemap ↔ build parity ────────────────────────────────────────────────
// The segmented sitemaps (src/pages/sitemap-*.xml.ts) must stay in lockstep
// with the emitted pages: every sitemap URL resolves to a real page, and
// every indexable page appears in exactly one segment.
const sitemapFailures = [];
const indexFile = path.join(PUBLIC_ROOT, 'sitemap-index.xml');
if (!fs.existsSync(indexFile)) {
	sitemapFailures.push('sitemap-index.xml missing from build output');
} else {
	const segments = [...fs.readFileSync(indexFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)]
		.map((m) => new URL(m[1]).pathname);
	const seen = new Map(); // path → segment that listed it
	for (const segment of segments) {
		const segmentFile = path.join(PUBLIC_ROOT, segment.replace(/^\//, ''));
		if (!fs.existsSync(segmentFile)) {
			sitemapFailures.push(`${segment}: listed in the index but not emitted`);
			continue;
		}
		for (const m of fs.readFileSync(segmentFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
			const urlPath = new URL(m[1]).pathname;
			if (!targetExists(urlPath)) sitemapFailures.push(`${segment}: ${urlPath} does not resolve to a built page`);
			if (seen.has(urlPath)) sitemapFailures.push(`${urlPath} listed in both ${seen.get(urlPath)} and ${segment}`);
			seen.set(urlPath, segment);
		}
	}
	// Completeness: every indexable emitted page must be in a segment.
	for (const file of htmlFiles) {
		const relative = path.relative(PUBLIC_ROOT, file);
		if (relative === '404.html' || /^google[a-z0-9]+\.html$/i.test(relative)) continue;
		const html = fs.readFileSync(file, 'utf8');
		if (/name="robots" content="noindex/.test(html)) continue;
		const urlPath = '/' + relative.replace(/index\.html$/, '').replace(/\.html$/, '/');
		if (!seen.has(urlPath)) sitemapFailures.push(`${urlPath} is indexable but missing from every sitemap segment`);
	}
}

if (sitemapFailures.length) {
	console.error('\nSitemap failures:');
	for (const item of sitemapFailures) console.error(`- ${item}`);
}

if (
	semanticFailures.length ||
	missingTargets.size ||
	redirectingInternalLinks.length ||
	hierarchyFailures.length ||
	imageFailures.length ||
	socialImageFailures.length ||
	newsletterFeedbackFailures.length ||
	shareFeedbackFailures.length ||
	overlayStateFailures.length ||
	sitemapFailures.length
) process.exit(1);

console.log(
	`✓ ${htmlFiles.length} HTML pages checked · headings, landmarks, article and social images, internal links and segmented sitemaps validated.`,
);
