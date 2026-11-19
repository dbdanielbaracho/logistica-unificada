import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../.github/workflows/external-health.yml', import.meta.url), 'utf8');

test('external smoke remains scheduled and manually dispatchable', () => {
  assert.match(workflow, /^on:\s*$/m);
  assert.match(workflow, /^\s+schedule:\s*$/m);
  assert.match(workflow, /^\s+- cron: ['"]17 \* \* \* \*['"]\s*$/m);
  assert.match(workflow, /^\s+workflow_dispatch:\s*$/m);
});

test('external smoke retains least privilege and bounded execution', () => {
  assert.match(workflow, /^permissions:\s*\n\s+contents: read\s*$/m);
  assert.match(workflow, /^\s+timeout-minutes: 5\s*$/m);
  assert.match(workflow, /^\s+runs-on: ubuntu-latest\s*$/m);
  assert.match(workflow, /^\s+node-version: ['"]22['"]\s*$/m);
});

test('external smoke targets only the public health contract without secrets', () => {
  assert.match(workflow, /^\s+SMOKE_BASE_URL: https:\/\/[^\s/@]+\s*$/m);
  assert.match(workflow, /^\s+run: node scripts\/smoke-health\.mjs\s*$/m);
  assert.doesNotMatch(workflow, /\$\{\{\s*secrets\./i);
});
