import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createSessionToken, digestSessionToken } from '../lib/server/session-token.mjs';

test('30 issued sessions have distinct tokens and matching digests', () => {
  const tokens = Array.from({length: 30}, () => createSessionToken());
  assert.equal(new Set(tokens.map(x => x.token)).size, 30);
  for (const {token, digest} of tokens) {
    assert.equal(digestSessionToken(token), digest);
    assert.equal(digest.length, 64);
    assert.notEqual(token, digest);
  }
});
test('30 deterministic synthetic tokens match SHA-256 of raw bytes', () => {
  for (let i = 0; i < 30; i++) {
    const bytes = Buffer.alloc(32, i);
    const token = bytes.toString('base64url');
    assert.equal(digestSessionToken(token), createHash('sha256').update(bytes).digest('hex'));
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const last = alphabet.indexOf(token.at(-1));
    assert.equal(digestSessionToken(token.slice(0,-1) + alphabet[last + 1]), null);
  }
});
test('rejects malformed or non-string bearer tokens', () => {
  for (const token of [null, undefined, 42, {}, '', 'A'.repeat(42), 'A'.repeat(44), 'A'.repeat(43)+'=', ' '+ 'A'.repeat(43)]) {
    assert.equal(digestSessionToken(token), null);
  }
});
