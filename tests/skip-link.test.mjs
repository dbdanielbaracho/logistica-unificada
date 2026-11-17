import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('keyboard users can skip directly to the main landmark', () => {
  const page = readFileSync('src/app/page.tsx', 'utf8');
  const styles = readFileSync('src/app/globals.css', 'utf8');
  assert.match(page, /href="#conteudo-principal"/);
  assert.match(page, /<main id="conteudo-principal" tabIndex=\{-1\}/);
  assert.match(styles, /\.skipLink:focus-visible\s*\{/);
  assert.match(styles, /\.skipLink\s*\{[^}]*transform:translateY\(-180%\)/);
});
