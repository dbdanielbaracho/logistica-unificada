import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('quality gates allow explicit reruns and bound CI execution without write access', () => {
  const workflow = readFileSync('.github/workflows/ci.yml', 'utf8');
  assert.match(workflow, /^\s{2}workflow_dispatch:\s*$/m);
  assert.match(workflow, /^permissions:\s*\n\s{2}contents:\s*read\s*$/m);
  assert.doesNotMatch(workflow, /^\s+(?:actions|contents|deployments|id-token|packages|pull-requests|statuses):\s*write\s*$/m);
  const match = workflow.match(/^\s{4}timeout-minutes:\s*(\d+)\s*$/m);
  assert.ok(match, 'verify job must define a timeout');
  const timeout = Number(match[1]);
  assert.ok(Number.isSafeInteger(timeout) && timeout >= 1 && timeout <= 30,
    'CI timeout must be between 1 and 30 minutes');
});
