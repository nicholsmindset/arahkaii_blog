// validate-content.mjs — source-level editorial gates, run as part of
// `npm run verify` (before the build; complements the post-build validators).
//
//   node scripts/validate-content.mjs
//
// Gates (hard failures, published posts only unless noted):
//   1. AUTHOR   — every post's `author` resolves to src/content/authors/<id>.md
//                 (the Zod schema keeps this a free string, so a typo would
//                 otherwise build green and 500 at render).
//   2. HALAL    — every published dining/travel post carries `halalStatus`.
//                 This is now an INTERNAL editorial QA record only — it is no
//                 longer rendered on the page (religious labelling is not
//                 foregrounded publicly). The gate still enforces that the
//                 pork-free/alcohol-free curation was checked: verification-
//                 bearing statuses (muis-certified, muslim-owned,
//                 pork-free-no-alcohol) must include a `verifiedDate` less than
//                 six months old. Mixed-status guides and not-applicable need
//                 no date. "Never fudge" — a stale verification fails the gate.
//   3. CLUSTER  — every `cluster:` value resolves to src/content/clusters/<id>.md;
//                 every cluster has exactly one published pillar; no published
//                 clustered article is an orphan (fewer than MIN_INBOUND
//                 inbound links from other published posts).
//   4. CREDIT   — no published post ships a placeholder hero credit.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const POSTS = path.join(ROOT, 'src/content/posts');
const AUTHORS = path.join(ROOT, 'src/content/authors');
const CLUSTERS = path.join(ROOT, 'src/content/clusters');
const SIX_MONTHS_MS = 182 * 24 * 60 * 60 * 1000;
const MIN_INBOUND = 1; // raise to 2 once each cluster carries 4+ members

const walk = (dir) =>
	fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const p = path.join(dir, entry.name);
		return entry.isDirectory() ? walk(p) : p;
	});

// Frontmatter access: the fields we gate on are all simple `key: value` /
// one-level nested scalars, matching how astro.config.mjs and url-index.mjs
// already read this frontmatter.
const fmBlock = (src) => {
	const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	return m ? m[1] : '';
};
const fmValue = (fm, key) => {
	const m = fm.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?\\s*$`, 'm'));
	return m ? m[1].trim() : null;
};

const errors = [];
const posts = walk(POSTS).filter((p) => /\.(md|mdx)$/.test(p));
const authorIds = new Set(fs.readdirSync(AUTHORS).map((f) => f.replace(/\.md$/, '')));
const clusterIds = new Set(
	fs.existsSync(CLUSTERS) ? fs.readdirSync(CLUSTERS).map((f) => f.replace(/\.md$/, '')) : [],
);

const published = [];
for (const file of posts) {
	const rel = path.relative(ROOT, file);
	const src = fs.readFileSync(file, 'utf8');
	const fm = fmBlock(src);
	const body = src.slice(src.indexOf(fm) + fm.length);
	const draft = fmValue(fm, 'draft') === 'true';
	const slug = path.basename(file).replace(/\.(md|mdx)$/, '');
	const category = fmValue(fm, 'category');
	const author = fmValue(fm, 'author');
	const cluster = fmValue(fm, 'cluster');
	const isPillar = fmValue(fm, 'isPillar') === 'true';
	const heroCredit = fmValue(fm, 'heroCredit') ?? '';

	// 1. AUTHOR — applies to drafts too: a bad id breaks the editorial pipeline.
	if (author && !authorIds.has(author)) {
		errors.push(`${rel}: author "${author}" has no profile in src/content/authors/`);
	}

	// 3a. CLUSTER reference — drafts included, same reasoning.
	if (cluster && !clusterIds.has(cluster)) {
		errors.push(`${rel}: cluster "${cluster}" is not defined in src/content/clusters/`);
	}

	if (draft) continue;
	published.push({ rel, fm, body, slug, category, cluster, isPillar });

	// 2. HALAL
	if (category === 'dining' || category === 'travel') {
		if (!/^halalStatus:/m.test(fm)) {
			errors.push(`${rel}: published ${category} post has no halalStatus (use not-applicable / mixed-status-guide when honest)`);
		} else {
			const status = fm.match(/^halalStatus:\s*\n\s+status:\s*["']?([\w-]+)/m)?.[1];
			const needsDate = ['muis-certified', 'muslim-owned', 'pork-free-no-alcohol'].includes(status);
			const dateStr = fm.match(/^\s+verifiedDate:\s*["']?([\d-]+)/m)?.[1];
			if (needsDate && !dateStr) {
				errors.push(`${rel}: halalStatus "${status}" requires a verifiedDate`);
			} else if (dateStr && Date.now() - new Date(dateStr).valueOf() > SIX_MONTHS_MS) {
				errors.push(`${rel}: halal verifiedDate ${dateStr} is older than six months — re-verify before it ships`);
			}
		}
	}

	// 4. CREDIT — reject placeholder credits AND placeholder hero files: a
	// stock blog-placeholder-*.jpg credited "Arahkaii" must not publish either.
	if (/placeholder/i.test(heroCredit)) {
		errors.push(`${rel}: published post carries a placeholder hero credit`);
	}
	const heroImage = fmValue(fm, 'heroImage') ?? '';
	if (/blog-placeholder-/i.test(heroImage)) {
		errors.push(`${rel}: published post uses a placeholder hero image (${heroImage.split('/').pop()})`);
	}
}

// 3b. CLUSTER structure — pillar-per-cluster and orphan checks over published posts.
const byCluster = new Map();
for (const p of published) {
	if (!p.cluster) continue;
	if (!byCluster.has(p.cluster)) byCluster.set(p.cluster, []);
	byCluster.get(p.cluster).push(p);
}
for (const [cluster, members] of byCluster) {
	const pillars = members.filter((m) => m.isPillar);
	if (pillars.length === 0) errors.push(`cluster "${cluster}": no published pillar (set isPillar: true on the lead guide)`);
	if (pillars.length > 1) errors.push(`cluster "${cluster}": ${pillars.length} pillars — a cluster has exactly one`);
}

// Inbound internal links per clustered post, counted across all published bodies.
const inbound = new Map();
for (const p of published) {
	const links = [...p.body.matchAll(/\]\((\/[^)#?\s]+)/g)].map((m) => m[1].replace(/\/$/, ''));
	for (const link of links) {
		const target = published.find((q) => q !== p && link.endsWith(`/${q.slug}`));
		if (target) inbound.set(target.slug, (inbound.get(target.slug) ?? 0) + 1);
	}
}
for (const p of published) {
	if (!p.cluster) continue;
	const count = inbound.get(p.slug) ?? 0;
	if (count < MIN_INBOUND) {
		errors.push(`${p.rel}: clustered article is an orphan — ${count} inbound internal link(s), needs ≥${MIN_INBOUND}`);
	}
}

console.log(`Checked ${posts.length} posts (${published.length} published) · ${byCluster.size} clusters in use`);
if (errors.length) {
	console.error(`\n✗ ${errors.length} content problem(s):`);
	for (const e of errors) console.error('  - ' + e);
	process.exit(1);
}
console.log('✓ Authors, halal verification, clusters and credits all pass.');
