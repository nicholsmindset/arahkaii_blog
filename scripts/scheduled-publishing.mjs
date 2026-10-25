import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import matter from 'gray-matter';

export const SITE = 'https://www.arahkaii.com';
const CATEGORIES = new Set(['style', 'beauty', 'dining', 'travel', 'culture', 'living', 'people', 'guides']);

// Match the production listing/sitemap policy. Approval is the human-reviewed
// main-branch merge; this script never changes draft flags, files or branches.
export function duePostPaths(postsDir, now = new Date()) {
	const paths = [];
	for (const entry of fs.readdirSync(postsDir, { withFileTypes: true })) {
		const file = path.join(postsDir, entry.name);
		if (entry.isDirectory()) { paths.push(...duePostPaths(file, now)); continue; }
		if (!/\.mdx?$/.test(entry.name)) continue;
		const { data } = matter(fs.readFileSync(file, 'utf8'));
		for (const flag of ['draft', 'noindex']) {
			if (data[flag] !== undefined && typeof data[flag] !== 'boolean') throw new Error(`Invalid ${flag}: ${file}`);
		}
		if (data.draft || data.noindex) continue;
		const date = new Date(data.date);
		if (!Number.isFinite(date.valueOf())) throw new Error(`Invalid publication date: ${file}`);
		if (!CATEGORIES.has(data.category)) throw new Error(`Invalid category: ${file}`);
		if (date > now) continue;
		paths.push(`/${data.category}/${entry.name.replace(/\.mdx?$/, '')}/`);
	}
	return paths.sort();
}

// Parse only this site's intentionally small, fixed sitemap format. Fail closed
// on a login/error page, truncated response or unexpected external origin.
export function sitemapPaths(xml) {
	if (!/^\s*<\?xml[^>]*>\s*<urlset\s+xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">[\s\S]*<\/urlset>\s*$/.test(xml)) {
		throw new Error('Production article sitemap is not the expected XML document. No deployment requested.');
	}
	const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
	if (matches.length !== (xml.match(/<url>/g) ?? []).length) throw new Error('Incomplete production sitemap.');
	return new Set(matches.map(([, value]) => {
		const url = new URL(value.replaceAll('&amp;', '&'));
		if (url.origin !== SITE) throw new Error('Unexpected sitemap origin.');
		return url.pathname;
	}));
}

export async function missingPosts(due, fetchImpl = fetch) {
	const response = await fetchImpl(`${SITE}/sitemap-posts.xml?scheduled-check=${Date.now()}`, {
		headers: { 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(30000), redirect: 'error',
	});
	if (!response.ok) throw new Error(`Production sitemap returned HTTP ${response.status}. No deployment requested.`);
	const live = sitemapPaths(await response.text());
	return due.filter((url) => !live.has(url));
}

export async function requestDeployment(hook, fetchImpl = fetch) {
	let url;
	try { url = new URL(hook); } catch { throw new Error('Configure the VERCEL_DEPLOY_HOOK secret first.'); }
	if (url.origin !== 'https://api.vercel.com' || !/^\/v1\/integrations\/deploy\/[^/]+\/[^/]+$/.test(url.pathname) || url.username || url.password || url.hash) {
		throw new Error('Invalid Vercel deploy hook.');
	}
	// Never expose the URL in logs or network exceptions: it is a credential.
	let response;
	try {
		response = await fetchImpl(url, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(30000) });
	} catch { throw new Error('Deploy hook request failed. Check Vercel; the request may already have been accepted.'); }
	if (!response.ok) throw new Error(`Deploy hook returned HTTP ${response.status}.`);
	const result = await response.json().catch(() => null);
	if (!result?.job?.id || !['PENDING', 'BUILDING', 'READY'].includes(result.job.state)) throw new Error('Vercel did not confirm an accepted deployment job.');
	return result.job.id;
}

async function main() {
	const deploy = process.argv.includes('--deploy');
	if (deploy && (process.env.GITHUB_REF !== 'refs/heads/main' || process.env.GITHUB_REPOSITORY !== 'nicholsmindset/arahkaii_blog')) {
		throw new Error('Deployment is restricted to the reviewed main branch of nicholsmindset/arahkaii_blog.');
	}
	const due = duePostPaths(path.resolve('src/content/posts'));
	let missing = await missingPosts(due);
	console.log(`${due.length} due, indexable stories; ${missing.length} absent from the production sitemap.`);
	if (!deploy && process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `needs_rebuild=${missing.length > 0}\n`);
	for (const url of missing) console.log(`Waiting: ${url}`);
	if (!missing.length || !deploy) return;
	await requestDeployment(process.env.VERCEL_DEPLOY_HOOK);
	console.log('Vercel accepted the rebuild. Waiting for the stories to appear on production.');
	for (let attempt = 0; attempt < 20; attempt++) {
		await new Promise((resolve) => setTimeout(resolve, 30000));
		missing = await missingPosts(due);
		if (!missing.length) { console.log('Confirmed: all due stories appear in the production sitemap.'); return; }
	}
	throw new Error('Stories are still absent after 10 minutes. Check Vercel deployment logs; the next hourly run can retry.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
