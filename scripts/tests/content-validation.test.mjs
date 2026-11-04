import test from 'node:test';
import assert from 'node:assert/strict';
import { duplicateSourceUrlIndexes } from '../../src/lib/content-validation.ts';

test('source URL validation accepts distinct citations', () => {
	assert.deepEqual(duplicateSourceUrlIndexes([
		{ url: 'https://example.com/report' },
		{ url: 'https://example.com/methodology' },
	]), []);
});

test('source URL validation identifies every repeated citation', () => {
	assert.deepEqual(duplicateSourceUrlIndexes([
		{ url: 'https://example.com/report' },
		{ url: 'https://example.com/other' },
		{ url: 'https://example.com/report' },
		{ url: 'https://example.com/report' },
	]), [2, 3]);
});

test('source URL validation compares canonical URL forms', () => {
	assert.deepEqual(duplicateSourceUrlIndexes([
		{ url: 'https://EXAMPLE.com' },
		{ url: 'https://example.com/' },
	]), [1]);
});
