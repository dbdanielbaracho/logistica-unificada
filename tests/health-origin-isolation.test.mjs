import test from 'node:test';
import assert from 'node:assert/strict';
import { checkHealth } from '../scripts/smoke-health.mjs';

const healthy = () => ({
  status: 200,
  headers: new Headers({ 'content-type': 'application/json' }),
  json: async () => ({ status: 'ok', service: 'logistica-unificada' }),
});

test('health check never follows configured private paths, query strings or fragments', async () => {
  let requests = 0;
  const fetcher = async (url, options) => {
    requests++;
    assert.equal(url.href, 'https://example.test/api/health');
    assert.equal(options.redirect, 'error');
    assert.equal(options.cache, 'no-store');
    assert.equal(options.headers.accept, 'application/json');
    return healthy();
  };
  assert.equal(await checkHealth('https://example.test/private/contracts?token=do-not-send#fragment', fetcher), true);
  assert.equal(requests, 1);
});

test('health check refuses credential-bearing origins before any request', async () => {
  let requests = 0;
  const fetcher = async () => { requests++; return healthy(); };
  for (const origin of [
    'https://user:password@example.test/private',
    'https://user@example.test/',
    'https://:password@example.test/',
  ]) {
    await assert.rejects(checkHealth(origin, fetcher), /Credentials are not allowed/);
  }
  assert.equal(requests, 0);
});

test('health check refuses unsupported schemes before any request', async () => {
  let requests = 0;
  const fetcher = async () => { requests++; return healthy(); };
  for (const origin of ['file:///tmp/health', 'ftp://example.test/', 'data:text/plain,ok']) {
    await assert.rejects(checkHealth(origin, fetcher), /Unsupported protocol/);
  }
  assert.equal(requests, 0);
});
