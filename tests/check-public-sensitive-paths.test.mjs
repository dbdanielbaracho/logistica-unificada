import test from 'node:test';
import assert from 'node:assert/strict';
import { checkPublicSensitivePaths, SENSITIVE_PATHS } from '../scripts/check-public-sensitive-paths.mjs';

test('checks fixed paths independently and never follows redirects', async () => {
  const seen = [];
  const mock = async (url, options) => {
    seen.push({ path: url.pathname, options });
    return { status: 404, body: { cancel: async () => {} } };
  };
  assert.equal(await checkPublicSensitivePaths('https://example.org', mock), true);
  assert.deepEqual(seen.map(item => item.path), [...SENSITIVE_PATHS]);
  assert.ok(seen.every(item => item.options.redirect === 'error' && item.options.cache === 'no-store'));
});

test('rejects non-HTTPS origins, credentials, paths and query strings', async () => {
  for (const origin of ['http://example.org', 'https://user:pass@example.org', 'https://example.org/path', 'https://example.org/?a=1']) {
    await assert.rejects(checkPublicSensitivePaths(origin, async () => { throw Error('should not fetch'); }));
  }
});

test('fails closed on a public response, redirects or server errors', async () => {
  for (const status of [200, 301, 403, 500]) {
    await assert.rejects(checkPublicSensitivePaths('https://example.org', async () => ({ status, body: { cancel: async () => {} } })));
  }
});

test('stops after the first failing path', async () => {
  let count = 0;
  await assert.rejects(checkPublicSensitivePaths('https://example.org', async () => {
    count++;
    return { status: count === 2 ? 200 : 404 };
  }));
  assert.equal(count, 2);
});

test('releases response bodies on both success and unexpected status without reading them', async () => {
  let canceled = 0;
  let read = 0;
  const body = {
    cancel: async () => { canceled++; },
    text: async () => { read++; throw Error('body must never be read'); },
  };
  await checkPublicSensitivePaths('https://example.org', async () => ({ status: 404, body }));
  assert.equal(canceled, SENSITIVE_PATHS.length);
  await assert.rejects(
    checkPublicSensitivePaths('https://example.org', async () => ({ status: 200, body })),
    /Unexpected status/,
  );
  assert.equal(canceled, SENSITIVE_PATHS.length + 1);
  assert.equal(read, 0);
});
