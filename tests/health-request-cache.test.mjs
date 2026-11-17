import test from 'node:test';
import assert from 'node:assert/strict';
import { checkHealth } from '../scripts/smoke-health.mjs';

test('health smoke explicitly bypasses HTTP caches when requesting availability', async () => {
  const fetcher = async (url, options) => {
    assert.equal(url.pathname, '/api/health');
    assert.equal(options.cache, 'no-store');
    assert.equal(options.redirect, 'error');
    assert.equal(options.headers.accept, 'application/json');
    return {
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ status: 'ok', service: 'logistica-unificada' }),
    };
  };
  assert.equal(await checkHealth('https://example.test', fetcher), true);
});
