import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Guard against accidentally disabling the quality gates while CI availability is investigated.
// This test verifies configuration only; it does not claim a GitHub-hosted run occurred.
test('quality gates retain PR and main push triggers with tests, typecheck and build', () => {
  const workflow = readFileSync('.github/workflows/ci.yml', 'utf8');
  assert.match(workflow, /^on:\s*\n\s+push:\s*\n\s+branches:\s*\[main\]/m);
  assert.match(workflow, /^\s+pull_request:\s*\n\s+branches:\s*\[main\]/m);
  for (const command of ['npm test', 'npm run lint', 'npm run build']) {
    assert.ok(workflow.includes('run: ' + command), 'missing CI command: ' + command);
  }
});
