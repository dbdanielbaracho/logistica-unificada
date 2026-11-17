import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Source contract test: the production Next.js build validates the route itself.
test('public health response explicitly disables intermediary caching', () => {
  const route = readFileSync(new URL('../src/app/api/health/route.ts', import.meta.url), 'utf8');
  assert.match(route, /NextResponse\.json\(/);
  assert.match(route, /['"]Cache-Control['"]\s*:\s*['"]no-store, max-age=0['"]/);
  assert.match(route, /service:\s*['"]logistica-unificada['"]/);
});
