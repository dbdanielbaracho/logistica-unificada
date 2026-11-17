import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

test('não existe endpoint financeiro ativo antes da homologação', () => {
  const routes = walk('src/app').filter(file => /\/api\/.*\/route\.(ts|tsx|js)$/.test(file.replaceAll('\\', '/')));
  const forbidden = /(pagamento|payment|checkout|wallet|carteira|escrow|cobranca|charge|pix|repasse)/i;
  for (const file of routes) assert.equal(forbidden.test(file), false, `Endpoint financeiro não homologado: ${file}`);
});

test('interface informa indisponibilidade de operações reais', () => {
  const page = fs.readFileSync('src/app/page.tsx', 'utf8');
  assert.match(page, /não executa operações/i);
  assert.match(page, /pagamentos só serão habilitados/i);
});
