import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword } from '../lib/server/password-crypto.mjs';

test('salted hashes verify only the original synthetic password', async () => {
  const password = 'fixture-only-001';
  const first = await hashPassword(password);
  const second = await hashPassword(password);
  assert.notEqual(first, second);
  assert.match(first, /^scrypt-v1:[0-9a-f]{32}:[0-9a-f]{64}$/);
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword(password + 'x', first), false);
});
test('rejects malformed hashes and invalid input without coercion', async () => {
  for (const value of [null, undefined, 123, {}, '', 'é'.repeat(513)]) {
    await assert.rejects(hashPassword(value), TypeError);
    assert.equal(await verifyPassword(value, 'invalid'), false);
  }
  for (const stored of [null, '', 'scrypt-v2:' + 'a'.repeat(97), 'scrypt-v1:' + 'z'.repeat(32) + ':' + 'a'.repeat(64)]) {
    assert.equal(await verifyPassword('fixture-only', stored), false);
  }
});
test('UTF-8 byte boundary is accepted without normalization', async () => {
  const password = 'é'.repeat(512);
  const stored = await hashPassword(password);
  assert.equal(await verifyPassword(password, stored), true);
  assert.equal(await verifyPassword(password.normalize('NFD'), stored), false);
});
