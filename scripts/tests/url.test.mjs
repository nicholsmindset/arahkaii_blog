import test from 'node:test';
import assert from 'node:assert/strict';
import { consumeQueryFlag } from '../../src/lib/url.ts';

test('one-time query flags are consumed without losing other URL state', () => {
	assert.equal(
		consumeQueryFlag('https://www.arahkaii.com/contact/?sent=1&enquiry=partnership#form', 'sent', '1'),
		'/contact/?enquiry=partnership#form',
	);
});

test('unexpected or absent query flags leave history untouched', () => {
	assert.equal(consumeQueryFlag('https://www.arahkaii.com/contact/?sent=0', 'sent', '1'), null);
	assert.equal(consumeQueryFlag('https://www.arahkaii.com/contact/', 'sent', '1'), null);
});
