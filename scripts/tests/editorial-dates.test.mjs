import assert from 'node:assert/strict';
import test from 'node:test';
import { SIX_MONTHS_MS, verificationDateIssue } from '../lib/editorial-dates.mjs';

const NOW = Date.UTC(2026, 9, 8, 12);

test('accepts a current verification date', () => {
	assert.equal(verificationDateIssue(new Date(NOW - 30 * 24 * 60 * 60 * 1000), NOW), null);
});

test('rejects a stale verification date', () => {
	assert.equal(verificationDateIssue(new Date(NOW - SIX_MONTHS_MS - 1), NOW), 'stale');
});

test('rejects a future verification date', () => {
	assert.equal(verificationDateIssue(new Date(NOW + 1), NOW), 'future');
});
