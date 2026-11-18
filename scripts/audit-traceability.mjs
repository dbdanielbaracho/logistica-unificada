import { readFileSync } from 'node:fs';

const file = new URL('../docs/matriz-rastreabilidade.md', import.meta.url);
const source = readFileSync(file, 'utf8');
const totals = { jornadas: 17, telas: 43, acoes: 107 };
const statuses = new Set(['BLOQUEADO_POR_EVIDENCIA', 'PENDENTE', 'IMPLEMENTADO_NAO_HOMOLOGADO', 'HOMOLOGADO']);
const rows = source.split(/\r?\n/).filter((line) => /^\|/.test(line));
const entries = rows.slice(2).map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim())).filter((cells) => cells.length === 11);
const verified = entries.filter((cells) => statuses.has(cells[10]) && cells[1] !== 'NÃO VERIFICADO');
const unique = (column, status) => new Set(verified.filter((cells) => cells[10] === status && cells[column] && cells[column] !== 'NÃO VERIFICADO').map((cells) => cells[column])).size;
const result = {
  fonte: 'docs/matriz-rastreabilidade.md',
  escopo_documental: totals,
  matriz_auditada: false,
  homologados: { jornadas: unique(1, 'HOMOLOGADO'), telas: unique(2, 'HOMOLOGADO'), acoes: unique(4, 'HOMOLOGADO') },
  observacao: 'Sem fonte integral aprovada e cobertura conferida, percentuais globais não podem ser calculados.'
};
if (verified.length > 0) {
  throw new Error('Linhas verificadas exigem auditoria de cobertura do Mestre v19 antes de gerar percentuais.');
}
process.stdout.write(JSON.stringify(result, null, 2) + '\n');
