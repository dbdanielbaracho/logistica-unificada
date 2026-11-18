import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const totals = Object.freeze({ jornadas: 17, telas: 43, acoes: 107 });
const statuses = ['BLOQUEADO_POR_EVIDENCIA', 'PENDENTE', 'IMPLEMENTADO_NAO_HOMOLOGADO', 'HOMOLOGADO'];
const isPlaceholder = (value) => !value || value === 'NÃO VERIFICADO' || value === '—';

export function auditMatrix(source) {
  const rows = source.split(/\r?\n/).filter((line) => /^\|/.test(line));
  const entries = rows.slice(2).map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()));
  const counted = Object.fromEntries(statuses.map((status) => [status, { jornadas: 0, telas: 0, acoes: 0 }]));
  const ids = Object.fromEntries(statuses.map((status) => [status, [new Set(), new Set(), new Set()]]));
  const ownership = new Map();
  for (const cells of entries) {
    if (cells.length !== 11 || !statuses.includes(cells[10])) {
      throw new Error('Linha de rastreabilidade com estrutura ou status inválido.');
    }
    if (cells[1] === 'NÃO VERIFICADO') {
      if (cells[10] !== 'BLOQUEADO_POR_EVIDENCIA' || ![cells[2], cells[4]].every((value) => value === 'NÃO VERIFICADO')) {
        throw new Error('Linha não verificada não pode declarar status ou identificadores funcionais.');
      }
      continue;
    }
    if (isPlaceholder(cells[0]) || isPlaceholder(cells[1]) || isPlaceholder(cells[2]) || isPlaceholder(cells[4]) || isPlaceholder(cells[7])) {
      throw new Error('Linha verificada sem versão, identificadores ou evidência.');
    }
    if (cells[10] === 'HOMOLOGADO' && [cells[8], cells[9]].some(isPlaceholder)) {
      throw new Error('Homologação sem PR/commit ou teste rastreável.');
    }
    const key = [cells[1], cells[2], cells[3], cells[4], cells[5]].join('\u001f');
    const previous = ownership.get(key);
    if (previous && previous !== cells[10]) {
      throw new Error('Mesma relação de rastreabilidade com status conflitantes na matriz.');
    }
    ownership.set(key, cells[10]);
    for (const [index, column] of [[1, 0], [2, 1], [4, 2]]) ids[cells[10]][column].add(cells[index]);
  }
  for (const status of statuses) {
    const [j, t, a] = ids[status];
    counted[status] = { jornadas: j.size, telas: t.size, acoes: a.size };
  }
  return {
    fonte: 'docs/matriz-rastreabilidade.md',
    escopo_documental: totals,
    matriz_auditada: false,
    registros_por_status: counted,
    observacao: 'Contagens por status são registros parciais da matriz, não totais concluídos; percentuais globais exigem auditoria da fonte aprovada.'
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const source = readFileSync(new URL('../docs/matriz-rastreabilidade.md', import.meta.url), 'utf8');
  process.stdout.write(JSON.stringify(auditMatrix(source), null, 2) + '\n');
}
