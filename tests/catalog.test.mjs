import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
test('Os quatro perfis aparecem no catálogo de navegação', () => {
  const code = fs.readFileSync('src/lib/catalog.ts', 'utf8');
  for (const name of ['empresa:', 'caminhoneiro:', 'motorista:', 'ajudante:']) assert.ok(code.includes(name), name);
});
