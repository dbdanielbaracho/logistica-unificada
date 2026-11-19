import test from 'node:test';
import assert from 'node:assert/strict';
import { diagnosePublicHealth } from '../scripts/diagnose-public-health.mjs';

const url = 'https://example.org/api/health';

test('DNS failure is distinguished from application failure without making an HTTP call', async () => {
  let called = false;
  const result = await diagnosePublicHealth(url, async () => { const error = new Error('resolution failed'); error.code = 'ENOTFOUND'; throw error; }, async () => { called = true; });
  assert.deepEqual(result, { phase: 'dns', ok: false, hostname: 'example.org', code: 'ENOTFOUND' });
  assert.equal(called, false);
});

test('HTTP failure after successful DNS is reported as HTTP, not DNS', async () => {
  const result = await diagnosePublicHealth(url, async () => ({ address: '127.0.0.1' }), async () => { throw new Error('HTTP failed'); });
  assert.deepEqual(result, { phase: 'http', ok: false, hostname: 'example.org', code: 'Error' });
});

test('successful DNS and public health check are reported independently', async () => {
  let checked = false;
  const result = await diagnosePublicHealth(url, async () => ({ address: '127.0.0.1' }), async () => { checked = true; });
  assert.deepEqual(result, { phase: 'http', ok: true, hostname: 'example.org' });
  assert.equal(checked, true);
});

test('credential-bearing and unsupported URLs are rejected before any lookup', async () => {
  let called = false;
  const resolver = async () => { called = true; };
  await assert.rejects(diagnosePublicHealth('https://user:pass@example.org', resolver), /Credentials/);
  await assert.rejects(diagnosePublicHealth('ftp://example.org', resolver), /Unsupported/);
  assert.equal(called, false);
});
