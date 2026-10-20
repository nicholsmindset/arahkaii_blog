import test from 'node:test';
import assert from 'node:assert/strict';
import { normaliseSavedStoryHref } from '../../src/lib/saved-stories.ts';

const ORIGIN = 'https://www.arahkaii.com';

test('normalises internal saved-story links', () => {
	assert.equal(
		normaliseSavedStoryHref('/style/a-story/?ref=reading-list#detail', ORIGIN),
		'/style/a-story/?ref=reading-list#detail',
	);
});

test('rejects links that can navigate away from the publication', () => {
	for (const href of [
		'//example.com/story',
		'/\\example.com/story',
		'https://example.com/story',
		'javascript:alert(1)',
		undefined,
	]) {
		assert.equal(normaliseSavedStoryHref(href, ORIGIN), null);
	}
});
