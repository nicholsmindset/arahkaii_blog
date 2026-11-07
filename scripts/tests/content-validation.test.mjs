import test from 'node:test';
import assert from 'node:assert/strict';
import { requiredEditorialText } from '../../src/lib/content-validation.ts';

test('required editorial text rejects blank copy', () => {
	const schema = requiredEditorialText(10);

	for (const value of ['', ' ', '\n\t']) {
		assert.equal(schema.safeParse(value).success, false);
	}
});

test('required editorial text trims valid copy and enforces its limit', () => {
	const schema = requiredEditorialText(10);

	assert.equal(schema.parse('  Considered  '), 'Considered');
	assert.equal(schema.safeParse('Too many words').success, false);
});
