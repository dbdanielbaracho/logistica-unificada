import test from 'node:test';
import assert from 'node:assert/strict';
import { checkHealth } from '../scripts/smoke-health.mjs';

const response = (status, type, body) => ({
  status,
  headers: { get: key => key.toLowerCase() === 'content-type' ? type : null },
  json: async () => body,
});

test('accepts exact public health contract and requests only fixed endpoint', async () => {
  let calls = 0;
  const fetcher = async (url, options) => {
    calls++;
    assert.equal(url.href, 'https://example.org/api/health');
    assert.equal(options.redirect, 'error');
    assert.equal(options.cache, 'no-store');
    assert.equal(options.headers.accept, 'application/json');
    assert.ok(options.signal instanceof AbortSignal);
    return response(200, 'application/json; charset=utf-8', { status: 'ok', service: 'logistica-unificada' });
  };
  assert.equal(await checkHealth('https://example.org/ignored?token=not-forwarded', fetcher), true);
  assert.equal(calls, 1);
});

test('rejects wrong service, status, and content type', async () => {
  for (const [res, message] of [
    [response(503, 'application/json', { status: 'ok', service: 'logistica-unificada' }), /non-200/],
    [response(200, 'text/html', { status: 'ok', service: 'logistica-unificada' }), /non-JSON/],
    [response(200, 'application/json', { status: 'ok', service: 'another-service' }), /mismatch/],
    [response(200, 'application/json', { status: 'degraded', service: 'logistica-unificada' }), /mismatch/],
  ]) {
    await assert.rejects(checkHealth('https://example.org', async () => res), message);
  }
});

test('rejects credential-bearing and non-http URLs without network access', async () => {
  let called = false;
  const fetcher = async () => { called = true; throw new Error('unexpected fetch'); };
  for (const url of ['https://user:secret@example.org', 'ftp://example.org', 'file:///etc/passwd']) {
    await assert.rejects(checkHealth(url, fetcher));
  }
  assert.equal(called, false);
});
