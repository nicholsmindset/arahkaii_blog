import test from 'node:test';
import assert from 'node:assert/strict';
import { hasUniqueNormalisedValues } from '../../src/lib/content-validation.ts';

test('structured content values must be unique after case and whitespace normalisation', () => {
	assert.equal(hasUniqueNormalisedValues(['First', 'Second'], (item) => item), true);
	assert.equal(hasUniqueNormalisedValues(['First', ' first '], (item) => item), false);
});

test('structured objects can select the reader-facing field used for uniqueness', () => {
	const questions = [
		{ q: 'What is quiet luxury?', a: 'First answer' },
		{ q: 'WHAT IS QUIET LUXURY?', a: 'Second answer' },
	];
	assert.equal(hasUniqueNormalisedValues(questions, (item) => item.q), false);
});
