import assert from 'node:assert/strict';
import test from 'node:test';

import { withinRateLimit } from '../../src/lib/api-guard.ts';

test('rate-limit capacity evicts one bucket without resetting other active limits', () => {
	const prefix = `${Date.now()}:${Math.random()}`;
	const oldest = `${prefix}:oldest`;
	const active = `${prefix}:active`;

	assert.equal(withinRateLimit(oldest, 1, 60_000), true);
	assert.equal(withinRateLimit(active, 1, 60_000), true);
	for (let i = 0; i < 4_998; i += 1) {
		assert.equal(withinRateLimit(`${prefix}:${i}`, 1, 60_000), true);
	}

	assert.equal(withinRateLimit(`${prefix}:new`, 1, 60_000), true);
	assert.equal(withinRateLimit(active, 1, 60_000), false);
	assert.equal(withinRateLimit(oldest, 1, 60_000), true);
});
