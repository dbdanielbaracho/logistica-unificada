import test from 'node:test';
import assert from 'node:assert/strict';
import { sensitivePaths, checkSensitivePaths } from '../scripts/check-sensitive-paths.mjs';

test('sensitive-path catalog is immutable, unique and limited to absolute paths', () => {
  assert.equal(Object.isFrozen(sensitivePaths), true);
  assert.ok(sensitivePaths.length > 0);
  assert.equal(new Set(sensitivePaths).size, sensitivePaths.length);
  for (const path of sensitivePaths) {
    assert.equal(path.startsWith('/'), true);
    assert.ok(path.split('/').every(segment => /^[a-zA-Z0-9._-]*$/.test(segment)));
    assert.equal(path.startsWith('//'), false);
    assert.equal(path.split('/').includes('..'), false);
    assert.equal(path.split('/').includes('.'), false);
  }
});

test('each catalog path is probed exactly once without following redirects or exposing bodies', async () => {
  const seen = [];
  const results = await checkSensitivePaths('https://example.invalid/', {
    fetchImpl: async (url, options) => {
      seen.push(url.pathname);
      assert.equal(options.redirect, 'manual');
      assert.equal(options.cache, 'no-store');
      return new Response('SYNTHETIC_DO_NOT_LOG', { status: 404 });
    },
  });
  assert.deepEqual(seen, sensitivePaths);
  assert.ok(results.every(result => result.passed));
  assert.equal(JSON.stringify(results).includes('SYNTHETIC_DO_NOT_LOG'), false);
});
