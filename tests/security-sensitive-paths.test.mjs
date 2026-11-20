import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const sensitivePaths = [
  '/.env', '/.env.local', '/.git/config', '/.vscode/sftp.json',
  '/service_account.json', '/config/local.json', '/.aws/credentials',
];

test('sensitive-path probes are explicit and contain no secret values', () => {
  assert.equal(new Set(sensitivePaths).size, sensitivePaths.length);
  for (const path of sensitivePaths) {
    assert.ok(path.startsWith('/') && !path.includes('?') && !path.includes('#'));
    assert.ok(!path.includes('..'));
  }
});

test('Next security headers remain configured for every route', () => {
  const config = fs.readFileSync('next.config.ts', 'utf8');
  assert.match(config, /source:\s*["']\/:path\*["']/);
  for (const header of ['X-Content-Type-Options', 'Referrer-Policy', 'X-Frame-Options', 'Permissions-Policy']) {
    assert.ok(config.includes(header), `Missing security header: ${header}`);
  }
});

test('production public endpoints must not expose sensitive configuration paths', async (t) => {
  const base = process.env.SECURITY_TEST_BASE_URL;
  if (!base) return t.skip('Set SECURITY_TEST_BASE_URL for an authorized deployed target');
  const url = new URL(base);
  assert.equal(url.protocol, 'https:');
  assert.equal(url.username, '');
  assert.equal(url.password, '');
  assert.ok(['lu.predibeacon.com', 'logistica-web-production-cfbeefaa.up.railway.app'].includes(url.hostname));
  for (const path of sensitivePaths) {
    const response = await fetch(new URL(path, url), {
      redirect: 'manual',
      signal: AbortSignal.timeout(10000),
      headers: { accept: 'text/plain' },
    });
    assert.equal(response.status, 404, `Unexpected response for ${path}`);
    const body = await response.text();
    assert.ok(body.length < 100000, `Oversized response for ${path}`);
  }
});
