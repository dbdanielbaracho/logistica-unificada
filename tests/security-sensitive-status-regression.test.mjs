import test from 'node:test';
import assert from 'node:assert/strict';
import { checkSensitivePaths, sensitivePaths } from '../scripts/check-sensitive-paths.mjs';

test('only an exact 404 passes; no response bodies are returned or logged', async () => {
  const statuses = [200, 204, 301, 302, 401, 403, 500];
  for (const status of statuses) {
    let calls = 0;
    const fetchImpl = async (_url, options) => {
      calls++;
      assert.equal(options.redirect, 'manual');
      assert.equal(options.cache, 'no-store');
      assert.ok(options.signal instanceof AbortSignal);
      return new Response(status === 204 ? null : 'SYNTHETIC_SECRET_DO_NOT_LOG', { status });
    };
    const results = await checkSensitivePaths('http://127.0.0.1:1/', { fetchImpl });
    assert.equal(calls, sensitivePaths.length);
    assert.ok(results.every(result => result.status === status && result.passed === false));
    assert.equal(JSON.stringify(results).includes('SYNTHETIC_SECRET_DO_NOT_LOG'), false);
  }
});

test('a fetch failure is propagated rather than interpreted as a 404', async () => {
  await assert.rejects(
    checkSensitivePaths('http://127.0.0.1:1/', {
      fetchImpl: async () => { throw new TypeError('synthetic network failure'); },
    }),
    /synthetic network failure/
  );
});
