import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Static regression guard: does not replace HTTP integration or security assessment.
test('security header values remain restrictive across routes', () => {
  const config = fs.readFileSync('next.config.ts', 'utf8');
  const required = [
    ['X-Content-Type-Options', 'nosniff'],
    ['Referrer-Policy', 'strict-origin-when-cross-origin'],
    ['X-Frame-Options', 'DENY'],
    ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()'],
  ];
  for (const [key, value] of required) {
    const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp('key:\\s*["\\\']' + key + '["\\\']\\s*,\\s*value:\\s*["\\\']' + escaped + '["\\\']');
    assert.match(config, pattern, 'Header missing or weakened: ' + key);
  }
  assert.match(config, /source:\\s*["']\\/:path\\*["']/);
});
