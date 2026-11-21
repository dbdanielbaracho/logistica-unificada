import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../.github/workflows/external-health.yml', import.meta.url), 'utf8');

test('both public domains run health and defensive-header checks independently', () => {
  const jobs = workflow.split(/^jobs:\s*$/m)[1];
  assert.ok(jobs, 'external workflow must declare jobs');
  const expected = new Map([
    ['railway-health', 'https://logistica-web-production-cfbeefaa.up.railway.app'],
    ['custom-domain-health', 'https://lu.predibeacon.com'],
  ]);
  const sections = [...jobs.matchAll(/^  ([a-z][a-z-]*):\s*\n([\s\S]*?)(?=^  [a-z][a-z-]*:\s*$|$(?![\s\S]))/gm)];
  assert.equal(sections.length, expected.size, 'each domain must have its own job');
  for (const [, name, body] of sections) {
    assert.ok(expected.has(name), 'unexpected job: ' + name);
    const domain = expected.get(name);
    assert.ok(body.includes('SMOKE_BASE_URL: ' + domain), 'wrong domain for ' + name);
    assert.equal((body.match(/^\s+run: node scripts\/smoke-health\.mjs\s*$/gm) || []).length, 1);
    assert.equal((body.match(/^\s+run: node scripts\/check-public-security-headers\.mjs\s*$/gm) || []).length, 1);
    assert.doesNotMatch(body, /continue-on-error:\s*true|\$\{\{\s*secrets\./i);
  }
});
