import test from 'node:test';
import assert from 'node:assert/strict';
import { articlesWithUnsizedImages } from '../lib/validate-html.mjs';

test('image validation checks every article on a listing page', () => {
	const html = `
		<article><img src="first.jpg" width="800" height="600"></article>
		<article><img src="second.jpg" width="800"></article>
		<article><img src="third.jpg" height="600"></article>
	`;

	assert.deepEqual(articlesWithUnsizedImages(html), [2, 3]);
});

test('image validation reports each article at most once', () => {
	const html = `
		<article>
			<img src="first.jpg">
			<img src="second.jpg">
		</article>
	`;

	assert.deepEqual(articlesWithUnsizedImages(html), [1]);
});
