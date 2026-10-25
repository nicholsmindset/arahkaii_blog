import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { duePostPaths, sitemapPaths, missingPosts, requestDeployment, SITE } from '../scheduled-publishing.mjs';
const xml = (paths) => `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${SITE}${p}</loc></url>`).join('')}</urlset>`;

test('only due, non-draft, indexable articles qualify, with Singapore timestamp boundaries', () => {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'arahkaii-schedule-'));
	try {
		const put = (name, values) => fs.writeFileSync(path.join(dir, `${name}.md`), `---\ncategory: style\ndate: '2026-11-01T09:00:00+08:00'\n${values}\n---\nBody`);
		put('due', 'draft: false'); put('draft', 'draft: true'); put('hidden', 'noindex: true');
		assert.deepEqual(duePostPaths(dir, new Date('2026-11-01T00:59:59Z')), []);
		assert.deepEqual(duePostPaths(dir, new Date('2026-11-01T01:00:00Z')), ['/style/due/']);
		assert.deepEqual(duePostPaths(dir, new Date('2027-01-01T00:00:00Z')), ['/style/due/']);
		put('bad', 'draft: "false"');
		assert.throws(() => duePostPaths(dir), /Invalid draft/);
	} finally { fs.rmSync(dir, { recursive: true }); }
});

test('existing public stories do not cause another rebuild; missing stories do', async () => {
	const due = ['/style/live/', '/beauty/due/'];
	assert.deepEqual(await missingPosts(due, async () => new Response(xml(['/style/live/']))), ['/beauty/due/']);
	assert.deepEqual(await missingPosts(due, async () => new Response(xml(due))), []);
});

test('sitemap errors fail closed instead of triggering a rebuild', async () => {
	assert.throws(() => sitemapPaths('<html>Login required</html>'), /expected XML/);
	assert.throws(() => sitemapPaths(xml(['/style/a/']).replace(SITE, 'https://example.com')), /Unexpected sitemap/);
	await assert.rejects(() => missingPosts([], async () => new Response('', { status: 503 })), /503/);
});

test('hook validation and network errors do not expose credentials', async () => {
	let calls = 0;
	const hook = 'https://api.vercel.com/v1/integrations/deploy/prj_test/secret';
	const mock = async (_url, options) => { calls++; assert.equal(options.method, 'POST'); return Response.json({ job: { id: 'job', state: 'PENDING' } }); };
	await assert.rejects(() => requestDeployment(undefined, mock), /Configure/);
	await assert.rejects(() => requestDeployment('https://example.com/secret', mock), /Invalid/);
	assert.equal(calls, 0);
	assert.equal(await requestDeployment(hook, mock), 'job');
	await assert.rejects(() => requestDeployment(hook, async () => { throw new Error(hook); }), (e) => !e.message.includes('secret'));
	await assert.rejects(() => requestDeployment(hook, async () => Response.json({})), /did not confirm/);
});
