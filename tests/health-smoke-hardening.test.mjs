import test from 'node:test';
import assert from 'node:assert/strict';
import { checkHealth } from '../scripts/smoke-health.mjs';

const neverFetch = () => { throw new Error('Unexpected network request'); };

test('health smoke rejects embedded URL credentials before fetching', async () => {
  await assert.rejects(checkHealth('https://user:secret@example.test', neverFetch), /Credentials are not allowed/);
  await assert.rejects(checkHealth('https://user@example.test', neverFetch), /Credentials are not allowed/);
});

test('health smoke rejects unsupported protocols before fetching', async () => {
  await assert.rejects(checkHealth('file:///tmp/private', neverFetch), /Unsupported protocol/);
});

test('health smoke targets only the fixed public endpoint and rejects redirects', async () => {
  const fetcher = async (url, options) => {
    assert.equal(url.href, 'https://example.test/api/health');
    assert.equal(options.redirect, 'error');
    assert.equal(options.headers.accept, 'application/json');
    return { status: 200, headers: new Headers({ 'content-type': 'application/json' }), json: async () => ({ status: 'ok', service: 'logistica-unificada' }) };
  };
  assert.equal(await checkHealth('https://example.test/other/path?token=private#frag', fetcher), true);
});

test('health smoke rejects malformed JSON without succeeding', async () => {
  await assert.rejects(checkHealth('https://example.test', async () => ({
    status: 200, headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => { throw new SyntaxError('Invalid JSON'); }
  })), SyntaxError);
});
