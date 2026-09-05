import test from 'node:test';
import assert from 'node:assert/strict';
import { selectReadNext } from '../../src/lib/recirculation.ts';

const card = (id, category, tags = [], cluster) => ({ id, url: `/${category}/${id}/`, category, tags, cluster, date: new Date('2026-09-01') });
test('an older continuation in the topic outranks an unrelated new story', () => {
	const current = card('current', 'living', ['minimalism'], 'considered-home');
	const next = card('guide', 'guides', [], 'considered-home');
	const newest = { ...card('newest', 'style'), date: new Date('2026-09-05') };
	assert.equal(selectReadNext([current, newest, card('same-desk', 'living'), next], current), next);
});
test('shared subjects work across desks, without recommending the current story', () => {
	const current = card('current', 'beauty', ['tropical-skin']);
	const relevant = card('skin-guide', 'guides', ['tropical-skin']);
	assert.equal(selectReadNext([current, card('other', 'beauty'), relevant], current), relevant);
	assert.equal(selectReadNext([current], current), undefined);
});
