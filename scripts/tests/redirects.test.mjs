import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { postRedirects } from '../lib/redirects.mjs';

const post = (category, legacy) =>
	`---\ncategory: ${category}\nlegacyWpSlug: ${legacy}\n---\nBody\n`;

test('legacy WordPress slugs cannot point to conflicting articles', () => {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'arahkaii-redirects-'));
	try {
		fs.writeFileSync(path.join(dir, 'first.md'), post('style', 'former-url'));
		fs.writeFileSync(path.join(dir, 'second.mdx'), post('beauty', 'former-url'));

		assert.throws(
			() => postRedirects(dir),
			/Conflicting legacyWpSlug "former-url": \/style\/first\/ and \/beauty\/second\//,
		);
	} finally {
		fs.rmSync(dir, { recursive: true });
	}
});

test('distinct legacy WordPress slugs retain their redirects', () => {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'arahkaii-redirects-'));
	try {
		fs.writeFileSync(path.join(dir, 'first.md'), post('style', 'first-old-url'));
		fs.writeFileSync(path.join(dir, 'second.mdx'), post('beauty', 'second-old-url'));

		assert.deepEqual(postRedirects(dir), {
			'/first-old-url': '/style/first/',
			'/second-old-url': '/beauty/second/',
		});
	} finally {
		fs.rmSync(dir, { recursive: true });
	}
});
