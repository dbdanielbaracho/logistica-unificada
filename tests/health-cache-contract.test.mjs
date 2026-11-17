import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// This is a source-level guard; it does not replace a live HTTP header check.
test('public health response explicitly prevents caching stale availability', () => {
  const source = readFileSync(new URL('../src/app/api/health/route.ts', import.meta.url), 'utf8');
  assert.match(source, /export\s+function\s+GET\s*\(/);
  assert.match(source, /NextResponse\.json\s*\(/);
  assert.match(source, /['"]Cache-Control['"]\s*:\s*['"]no-store,\s*max-age=0['"]/);
});
