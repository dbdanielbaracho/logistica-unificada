import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync('.github/workflows/ci.yml', 'utf8');
test('quality gates aceitam disparo manual sem retirar push e pull request', () => {
  assert.match(workflow, /^on:\s*\n\s+workflow_dispatch:\s*$/m);
  assert.match(workflow, /^\s+push:\s*$/m);
  assert.match(workflow, /^\s+pull_request:\s*$/m);
  for (const command of ['npm test', 'npm run lint', 'npm run build']) {
    assert.ok(workflow.includes(command), `Comando obrigatório ausente: ${command}`);
  }
  assert.match(workflow, /contents:\s*read/);
});
