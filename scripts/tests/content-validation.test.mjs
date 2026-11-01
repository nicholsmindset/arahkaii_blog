import test from 'node:test';
import assert from 'node:assert/strict';
import { readingMinutesSchema } from '../../src/lib/content-validation.ts';

test('reading-time overrides accept positive whole minutes', () => {
	assert.equal(readingMinutesSchema.parse(1), 1);
	assert.equal(readingMinutesSchema.parse(12), 12);
});

test('reading-time overrides reject values that cannot be rendered truthfully', () => {
	for (const value of [0, -1, 1.5]) {
		assert.equal(readingMinutesSchema.safeParse(value).success, false);
	}
});
