import test from 'node:test';
import assert from 'node:assert/strict';
import { checkHealth } from '../scripts/smoke-health.mjs';

function mock(status, type, body) {
  return async (url, options) => {
    assert.equal(url.pathname, '/api/health');
    assert.equal(options.redirect, 'error');
    return { status, headers: new Headers({ 'content-type': type }), json: async () => body };
  };
}
test('health smoke accepts only the expected public health contract', async () => {
  assert.equal(await checkHealth('https://example.test', mock(200, 'application/json; charset=utf-8', {status:'ok',service:'logistica-unificada'})), true);
});
test('health smoke rejects errors and wrong service', async () => {
  await assert.rejects(checkHealth('https://example.test', mock(503, 'application/json', {})), /non-200/);
  await assert.rejects(checkHealth('https://example.test', mock(200, 'text/html', {})), /non-JSON/);
  await assert.rejects(checkHealth('https://example.test', mock(200, 'application/json', {status:'ok',service:'other'})), /mismatch/);
});
test('health smoke refuses non-http schemes', async () => {
  await assert.rejects(checkHealth('file:///tmp/secret', mock(200, 'application/json', {})), /Unsupported protocol/);
});

test('health smoke rejects misleading JSON-like content types', async () => {
  for (const type of ['application/jsonp', 'text/application/json', 'application/json-malformed']) {
    await assert.rejects(checkHealth('https://example.test', mock(200, type, { status: 'ok', service: 'logistica-unificada' })), /non-JSON/);
  }
  assert.equal(await checkHealth('https://example.test', mock(200, 'Application/JSON ; charset=UTF-8', { status: 'ok', service: 'logistica-unificada' })), true);
});
