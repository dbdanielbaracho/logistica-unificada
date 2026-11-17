import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('configuração define cabeçalhos básicos de proteção', () => {
  const config = fs.readFileSync('next.config.ts', 'utf8');
  for (const header of ['X-Content-Type-Options', 'Referrer-Policy', 'X-Frame-Options', 'Permissions-Policy']) {
    assert.ok(config.includes(header), `Cabeçalho ausente: ${header}`);
  }
  assert.match(config, /source:\s*["']\/:path\*["']/);
});
