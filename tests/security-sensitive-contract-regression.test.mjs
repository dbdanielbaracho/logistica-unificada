import test from 'node:test';
import assert from 'node:assert/strict';
import { checkSensitivePaths, sensitivePaths } from '../scripts/check-sensitive-paths.mjs';

test('all 404 responses pass and return only path/status/pass metadata', async () => {
  const calls = [];
  const results = await checkSensitivePaths('https://example.invalid/', {
    fetchImpl: async (url, options) => {
      calls.push({ url: url.toString(), options });
      return new Response('SYNTHETIC_PRIVATE_CONTENT', { status: 404 });
    },
  });
  assert.deepEqual(results, sensitivePaths.map(path => ({ path, status: 404, passed: true })));
  assert.equal(calls.length, sensitivePaths.length);
  for (let i = 0; i < calls.length; i++) {
    assert.equal(calls[i].url, 'https://example.invalid' + sensitivePaths[i]);
    assert.equal(calls[i].options.redirect, 'manual');
    assert.equal(calls[i].options.cache, 'no-store');
  }
  assert.equal(JSON.stringify(results).includes('SYNTHETIC_PRIVATE_CONTENT'), false);
});

test('input validation rejects unsafe base URLs without invoking fetch', async () => {
  let calls = 0;
  const fetchImpl = async () => { calls++; throw new Error('unexpected request'); };
  for (const base of [
    'ftp://example.invalid/', 'https://user@example.invalid/',
    'https://example.invalid/?q=1', 'https://example.invalid/#fragment',
    'https://example.invalid/subpath/',
  ]) {
    await assert.rejects(checkSensitivePaths(base, { fetchImpl }), /Invalid isolated test base URL/);
  }
  assert.equal(calls, 0);
});
