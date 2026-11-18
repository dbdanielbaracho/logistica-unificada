import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

test('audit reports documentary totals without invented completion percentages', () => {
  const output = execFileSync(process.execPath, ['scripts/audit-traceability.mjs'], { encoding: 'utf8' });
  const result = JSON.parse(output);
  assert.deepEqual(result.escopo_documental, { jornadas: 17, telas: 43, acoes: 107 });
  assert.equal(result.matriz_auditada, false);
  assert.deepEqual(result.homologados, { jornadas: 0, telas: 0, acoes: 0 });
  assert.doesNotMatch(output, /percentual_concluido|percentual_restante/);
});
