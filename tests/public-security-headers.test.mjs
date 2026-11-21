import test from 'node:test';
import assert from 'node:assert/strict';
import { checkPublicSecurityHeaders, REQUIRED_HEADERS } from '../scripts/check-public-security-headers.mjs';

function fake(headers = REQUIRED_HEADERS, status = 200) {
  return async (_url, options) => {
    assert.equal(options.redirect, 'error');
    assert.equal(options.cache, 'no-store');
    assert.equal(options.headers.accept, 'application/json');
    return { status, headers: new Headers(headers) };
  };
}

test('accepts all four defensive headers on public health', async () => {
  assert.equal(await checkPublicSecurityHeaders('https://example.org', fake()), true);
});
test('rejects missing or altered defensive headers', async () => {
  for (const name of Object.keys(REQUIRED_HEADERS)) {
    const absent = { ...REQUIRED_HEADERS };
    delete absent[name];
    await assert.rejects(checkPublicSecurityHeaders('https://example.org', fake(absent)), /security header/);
    await assert.rejects(checkPublicSecurityHeaders('https://example.org', fake({ ...REQUIRED_HEADERS, [name]: 'invalid' })), /security header/);
  }
});
test('rejects non-200, unsafe URL, credentials and unexpected paths', async () => {
  await assert.rejects(checkPublicSecurityHeaders('https://example.org', fake(REQUIRED_HEADERS, 503)), /HTTP 200/);
  for (const url of ['file:///tmp/a', 'https://user:pass@example.org', 'https://example.org/other', 'https://example.org/?q=1', 'https://example.org/#frag']) {
    await assert.rejects(checkPublicSecurityHeaders(url, fake()));
  }
});
test('requests only the fixed public health endpoint', async () => {
  await checkPublicSecurityHeaders('https://example.org', async (url, options) => {
    assert.equal(url.href, 'https://example.org/api/health');
    return fake()(url, options);
  });
});
