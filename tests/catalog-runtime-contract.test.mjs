import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

// Evaluate the actual TypeScript catalog rather than checking text fragments.
const source = fs.readFileSync('src/lib/catalog.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
}).outputText;
const { profiles, routeCopy } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));

test('every visible action resolves to a documented placeholder destination', () => {
  assert.deepEqual(Object.keys(profiles).sort(), ['ajudante', 'caminhoneiro', 'empresa', 'motorista']);
  const destinations = new Set(Object.keys(routeCopy));
  for (const [profile, definition] of Object.entries(profiles)) {
    assert.ok(definition.actions.length > 0, `Missing navigation for ${profile}`);
    for (const action of definition.actions) {
      assert.ok(action.label.trim(), `Empty label for ${profile}`);
      assert.ok(destinations.has(action.route), `Unknown destination ${profile}/${action.route}`);
      assert.match(routeCopy[action.route].description, /em implementação/i,
        `Premature completion claim: ${action.route}`);
    }
  }
});

test('freight and professional contracting are separate navigation destinations', () => {
  const company = profiles.empresa.actions;
  const byLabel = label => company.find(action => action.label === label)?.route;
  assert.equal(byLabel('Publicar frete'), 'fretes');
  assert.equal(byLabel('Contratar motorista'), 'contratos-motorista');
  assert.equal(byLabel('Contratar ajudante'), 'contratos-ajudante');
  assert.notEqual(byLabel('Publicar frete'), byLabel('Contratar motorista'));
  assert.notEqual(byLabel('Publicar frete'), byLabel('Contratar ajudante'));
  assert.equal(profiles.caminhoneiro.actions.find(action => action.label === 'Buscar fretes')?.route, 'fretes');
  for (const profile of ['motorista', 'ajudante']) {
    assert.ok(profiles[profile].actions.some(action => action.route === 'oportunidades'));
    assert.ok(profiles[profile].actions.every(action => action.route !== 'fretes'));
  }
});
