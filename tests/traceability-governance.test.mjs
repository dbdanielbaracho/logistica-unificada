import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('traceability template remains evidence-gated and does not claim homologation', () => {
  const matrix = read('docs/matriz-rastreabilidade.md');
  assert.match(matrix, /BLOQUEADO_POR_EVIDENCIA/);
  assert.match(matrix, /issue #1/i);
  assert.match(matrix, /não preenchida/i);
  assert.match(matrix, /17 jornadas/);
  assert.match(matrix, /43 telas-base/);
  assert.match(matrix, /107 ações/);
  assert.match(matrix, /HOMOLOGADO/);
  assert.match(matrix, /testes, deploy e evidência operacional/i);
});

test('implementation ledger separates documented scope from delivered software', () => {
  const implementation = read('docs/implementacao.md');
  assert.match(implementation, /17 jornadas/);
  assert.match(implementation, /43 telas-base/);
  assert.match(implementation, /107 ações/);
  assert.match(implementation, /números do inventário documental, não do software entregue/i);
  assert.match(implementation, /Não implementado ou não homologado/i);
});

test('governance prohibits unapproved financial activation and mixed domains', () => {
  const agents = read('AGENTS.md');
  assert.match(agents, /Frete e serviço profissional são domínios distintos/i);
  assert.match(agents, /operações reais desabilitadas/i);
  assert.match(agents, /Não inventar funcionalidade, regra de negócio, taxa/i);
});
