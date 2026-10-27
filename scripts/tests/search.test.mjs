import test from 'node:test';
import assert from 'node:assert/strict';
import { normaliseSearchText } from '../../src/lib/search.ts';

test('search normalisation ignores accents and case', () => {
	assert.equal(normaliseSearchText('CAFÉ in Hồ Chí Minh'), 'cafe in ho chi minh');
});

test('search normalisation preserves non-Latin scripts', () => {
	assert.equal(normaliseSearchText('東京 Seoul'), '東京 seoul');
});
