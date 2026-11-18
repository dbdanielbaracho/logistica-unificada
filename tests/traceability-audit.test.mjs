import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { auditMatrix } from '../scripts/audit-traceability.mjs';

const header = '| Versão | Jornada | Tela | Estado | Ação | Destino | Requisito | Evidência | PR | Teste | Status |\n|---|---|---|---|---|---|---|---|---|---|---|\n';
const row = (status = 'PENDENTE', evidence = 'EV-TESTE') => `| v19 | J-TESTE | E-TESTE | estado | A-TESTE | destino | requisito | ${evidence} | PR | teste | ${status} |`;

test('audit reports documentary totals without invented completion percentages', () => {
  const output = execFileSync(process.execPath, ['scripts/audit-traceability.mjs'], { encoding: 'utf8' });
  const result = JSON.parse(output);
  assert.deepEqual(result.escopo_documental, { jornadas: 17, telas: 43, acoes: 107 });
  assert.equal(result.matriz_auditada, false);
  assert.deepEqual(result.registros_por_status.HOMOLOGADO, { jornadas: 0, telas: 0, acoes: 0 });
  assert.doesNotMatch(output, /percentual_concluido|percentual_restante/);
});

test('accepts incremental evidence-backed entries without claiming full audit', () => {
  const result = auditMatrix(header + row() + '\n' + row());
  assert.equal(result.registros_por_status.PENDENTE.jornadas, 1);
  assert.equal(result.registros_por_status.PENDENTE.telas, 1);
  assert.equal(result.registros_por_status.PENDENTE.acoes, 1);
  assert.equal(result.matriz_auditada, false);
});

test('rejects incomplete evidence and unknown status', () => {
  assert.throws(() => auditMatrix(header + row('PENDENTE', '—')), /evidência/);
  assert.throws(() => auditMatrix(header + row('APROVADO')), /inválido/);
});

test('rejects same identifiers assigned to contradictory statuses', () => {
  assert.throws(() => auditMatrix(header + row('PENDENTE') + '\n' + row('IMPLEMENTADO_NAO_HOMOLOGADO')), /conflitantes/);
});

test('requires traceable PR and test for homologated entries', () => {
  const missingTest = row('HOMOLOGADO').replace('| PR | teste |', '| PR | — |');
  const missingPR = row('HOMOLOGADO').replace('| PR | teste |', '| — | teste |');
  assert.throws(() => auditMatrix(header + missingTest), /Homologação/);
  assert.throws(() => auditMatrix(header + missingPR), /Homologação/);
});

test('permits distinct actions in the same journey and screen at different stages', () => {
  const second = row('IMPLEMENTADO_NAO_HOMOLOGADO').replace('| A-TESTE |', '| A-TESTE-2 |');
  const result = auditMatrix(header + row('PENDENTE') + '\n' + second);
  assert.equal(result.registros_por_status.PENDENTE.jornadas, 1);
  assert.equal(result.registros_por_status.IMPLEMENTADO_NAO_HOMOLOGADO.jornadas, 1);
});

test('rejects unverified placeholder claiming implementation or action identifiers', () => {
  const placeholder = '| v19 | NÃO VERIFICADO | NÃO VERIFICADO | — | NÃO VERIFICADO | — | — | Issue #1 | — | — | BLOQUEADO_POR_EVIDENCIA |';
  assert.deepEqual(auditMatrix(header + placeholder).registros_por_status.HOMOLOGADO, { jornadas: 0, telas: 0, acoes: 0 });
  assert.throws(() => auditMatrix(header + placeholder.replace('BLOQUEADO_POR_EVIDENCIA', 'HOMOLOGADO')), /não verificada/);
  assert.throws(() => auditMatrix(header + placeholder.replace('| NÃO VERIFICADO | — | — | Issue #1', '| A-REAL | — | — | Issue #1')), /não verificada/);
});
