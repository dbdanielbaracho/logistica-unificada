import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Static regression guard; HTTP integration and security review remain separate.
test('configured security headers keep their protective values', () => {
  const config = fs.readFileSync('next.config.ts', 'utf8');
  const required = [
    ['X-Content-Type-Options', 'nosniff'],
    ['Referrer-Policy', 'strict-origin-when-cross-origin'],
    ['X-Frame-Options', 'DENY'],
    ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()'],
  ];
  for (const [key, value] of required) {
    assert.ok(config.includes(`{ key: "${key}", value: "${value}" }`),
      `Header missing or weakened: ${key}`);
  }
  assert.ok(config.includes('source: "/:path*"'), 'Global route coverage missing');
});
