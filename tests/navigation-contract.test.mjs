import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Checks structural consistency without asserting that documented journeys are implemented.
const catalog = fs.readFileSync('src/lib/catalog.ts', 'utf8');
const page = fs.readFileSync('src/app/page.tsx', 'utf8');
const layout = fs.readFileSync('src/app/layout.tsx', 'utf8');

const profiles = ['empresa', 'caminhoneiro', 'motorista', 'ajudante'];
const routes = ['fretes', 'caminhoes', 'contratos-motorista', 'contratos-ajudante', 'oportunidades', 'atividades'];

test('catálogo contém os quatro perfis e os seis destinos definidos no código inicial', () => {
  for (const profile of profiles) assert.match(catalog, new RegExp('\\b' + profile + ':\\s*\\{'));
  for (const route of routes) assert.ok(catalog.includes("'" + route + "':") || catalog.includes(route + ':'), 'destino ausente: ' + route);
});

test('tela inicial usa apenas o catálogo central e não simula uma operação', () => {
  assert.match(page, /profiles\[profile\]\.actions\.map/);
  assert.match(page, /routeCopy\[route\]/);
  assert.match(page, /não executa operações/);
  assert.match(page, /pagamentos só serão habilitados/);
});

test('idioma da interface é português brasileiro', () => {
  assert.match(layout, /lang="pt-BR"/);
});
