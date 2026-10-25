import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const validator = resolve('scripts/validate-content.mjs');

test('content validation rejects an empty post author', () => {
	const root = mkdtempSync(join(tmpdir(), 'arahkaii-content-'));
	try {
		mkdirSync(join(root, 'src/content/posts/2026'), { recursive: true });
		mkdirSync(join(root, 'src/content/authors'), { recursive: true });
		mkdirSync(join(root, 'src/content/clusters'), { recursive: true });
		writeFileSync(join(root, 'src/content/authors/editor.md'), '---\nname: Editor\n---\n');
		writeFileSync(
			join(root, 'src/content/posts/2026/missing-author.md'),
			'---\nauthor: ""\ndraft: true\n---\nDraft body.\n',
		);

		const result = spawnSync(process.execPath, [validator], { cwd: root, encoding: 'utf8' });

		assert.equal(result.status, 1);
		assert.match(result.stderr, /missing-author\.md: author is required/);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
