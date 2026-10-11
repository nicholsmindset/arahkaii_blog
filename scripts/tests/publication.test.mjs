import assert from 'node:assert/strict';
import test from 'node:test';
import { shouldBuildPostRoute } from '../../src/lib/publication.ts';

const now = new Date('2026-10-09T12:00:00Z');
const past = new Date('2026-10-08T12:00:00Z');
const future = new Date('2026-10-10T12:00:00Z');

test('production only builds published articles whose date has arrived', () => {
	assert.equal(shouldBuildPostRoute({ date: past }, now, false), true);
	assert.equal(shouldBuildPostRoute({ date: future }, now, false), false);
	assert.equal(shouldBuildPostRoute({ date: past, draft: true }, now, false), false);
	assert.equal(shouldBuildPostRoute({ date: future, draft: true }, now, false), false);
});

test('preview builds expose drafts before their scheduled publication date', () => {
	assert.equal(shouldBuildPostRoute({ date: past, draft: true }, now, true), true);
	assert.equal(shouldBuildPostRoute({ date: future, draft: true }, now, true), true);
	assert.equal(shouldBuildPostRoute({ date: future }, now, true), false);
});
