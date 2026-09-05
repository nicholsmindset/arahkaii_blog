import test from 'node:test';
import assert from 'node:assert/strict';
import { fmtDate } from '../../src/lib/format.ts';

test('publication dates retain the editorial day on UTC and US build servers', () => {
 const original = process.env.TZ;
 try {
  for (const zone of ['UTC', 'America/Los_Angeles', 'Asia/Singapore']) {
   process.env.TZ = zone;
   assert.equal(fmtDate(new Date('2026-09-04T00:27:36+08:00')), '4 September 2026');
   assert.equal(fmtDate(new Date('2026-09-04')), '4 September 2026');
  }
 } finally {
  if (original === undefined) delete process.env.TZ; else process.env.TZ = original;
 }
});
test('verification months retain the correct month across a UTC month boundary', () => {
 assert.equal(fmtDate(new Date('2026-03-01T00:15:00+08:00'), { month: 'long', year: 'numeric' }), 'March 2026');
});
