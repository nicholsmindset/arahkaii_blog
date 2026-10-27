import test from 'node:test';
import assert from 'node:assert/strict';
import { comparePostsNewestFirst } from '../../src/lib/post-order.ts';

const post = (id, date) => ({ id, data: { date: new Date(date) } });

test('posts sort newest first', () => {
	const posts = [post('older', '2026-08-01'), post('newer', '2026-09-01')];

	assert.deepEqual(posts.sort(comparePostsNewestFirst).map(({ id }) => id), ['newer', 'older']);
});

test('posts with equal timestamps sort deterministically by content ID', () => {
	const posts = [
		post('2026/zebra', '2026-09-01T00:00:00Z'),
		post('2026/alpha', '2026-09-01T00:00:00Z'),
	];

	assert.deepEqual(posts.sort(comparePostsNewestFirst).map(({ id }) => id), [
		'2026/alpha',
		'2026/zebra',
	]);
});
