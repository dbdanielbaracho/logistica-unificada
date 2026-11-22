import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('quality gates keep main and PR triggers, read-only permissions and mandatory commands', () => {
  const workflow = readFileSync('.github/workflows/ci.yml', 'utf8');
  assert.match(workflow, /^on:\s*\n(?:.|\n)*?^\s+push:\s*\n\s+branches:\s*\[main\]/m);
  assert.match(workflow, /^\s+pull_request:\s*\n\s+branches:\s*\[main\]/m);
  assert.match(workflow, /^permissions:\s*\n\s+contents:\s*read\s*$/m);
  assert.match(workflow, /node-version:\s*['"]?22['"]?/);
  for (const command of ['npm test', 'npm run lint', 'npm run build']) {
    assert.ok(workflow.includes('run: ' + command), 'missing CI command: ' + command);
  }
});
