import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../.github/workflows/external-health.yml', import.meta.url), 'utf8');

test('scheduled health smoke checks Railway and custom domain independently', () => {
  assert.match(workflow, /SMOKE_BASE_URL: https:\/\/logistica-web-production-cfbeefaa\.up\.railway\.app/);
  assert.match(workflow, /SMOKE_BASE_URL: https:\/\/lu\.predibeacon\.com/);
  assert.equal((workflow.match(/run: node scripts\/smoke-health\.mjs/g) || []).length, 2);
  assert.doesNotMatch(workflow, /continue-on-error:\s*true/);
});

test('custom-domain check has no credentials and keeps least privilege', () => {
  assert.match(workflow, /permissions:\s*\n\s+contents: read/);
  assert.doesNotMatch(workflow, /\$\{\{\s*secrets\./i);
  assert.match(workflow, /timeout-minutes: 5/);
});
