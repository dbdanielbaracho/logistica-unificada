import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync('.github/workflows/ci.yml', 'utf8');
const lines = workflow.split(/\r?\n/);
const triggerStart = lines.findIndex((line) => line === 'on:');
const permissionsStart = lines.findIndex((line, index) => index > triggerStart && /^[^\s#][^:]*:/.test(line));
const triggers = lines.slice(triggerStart + 1, permissionsStart).join('\n');

test('quality gates preservam gatilhos manual, push e pull request para main', () => {
  assert.ok(triggerStart >= 0, 'Bloco on ausente');
  assert.ok(permissionsStart > triggerStart, 'Fim do bloco on ausente');
  assert.match(triggers, /^  workflow_dispatch:\s*$/m);
  assert.match(triggers, /^  push:\s*\n    branches: \[main\]\s*$/m);
  assert.match(triggers, /^  pull_request:\s*\n    branches: \[main\]\s*$/m);
});

test('quality gates preservam permissões mínimas e os três comandos de verificação', () => {
  assert.match(workflow, /^permissions:\s*\n  contents: read\s*$/m);
  assert.match(workflow, /^  verify:\s*$/m);
  assert.match(workflow, /^    runs-on: ubuntu-latest\s*$/m);
  assert.match(workflow, /^          node-version: '22'\s*$/m);
  for (const command of ['npm test', 'npm run lint', 'npm run build']) {
    assert.match(workflow, new RegExp('^        run: ' + command.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&') + '\\s*$', 'm'));
  }
});
