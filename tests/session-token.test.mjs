import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createSessionToken, digestSessionToken } from '../lib/server/session-token.mjs';

test('30 issued tokens have unique digests and canonical encoding', () => {
  const tokens = Array.from({length: 30}, () => createSessionToken());
  assert.equal(new Set(tokens.map(x => x.token)).size, 30);
  assert.equal(new Set(tokens.map(x => x.digest)).size, 30);
  for (const {token, digest} of tokens) {
    assert.match(token, /^[A-Za-z0-9_-]{43}$/);
    assert.match(digest, /^[a-f0-9]{64}$/);
    assert.equal(digestSessionToken(token), digest);
  }
});

test('30 deterministic valid tokens match independent SHA-256 calculation', () => {
  for (let i = 0; i < 30; i++) {
    const bytes = Buffer.alloc(32, i);
    assert.equal(digestSessionToken(bytes.toString('base64url')), createHash('sha256').update(bytes).digest('hex'));
  }
});

test('malformed and noncanonical tokens are rejected without coercion', () => {
  const canonical = Buffer.alloc(32).toString('base64url');
  for (const value of [null, undefined, 0, {}, [], '', canonical + '=', canonical + '\n', canonical.slice(1), canonical.slice(0,-1)+'B', '+'.repeat(43), 'A'.repeat(44)]) {
    assert.equal(digestSessionToken(value), null);
  }
  for (let i = 0; i < 30; i++) assert.equal(digestSessionToken('A'.repeat(i)), null);
});
