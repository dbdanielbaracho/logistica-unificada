import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { Script } from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');

function loadCatalog() {
  const source = readFileSync('src/lib/catalog.ts', 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    reportDiagnostics: true,
  });
  const errors = (compiled.diagnostics ?? []).filter(d => d.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, 'catalog must transpile without errors');
  const module = { exports: {} };
  new Script('(function(module, exports) { ' + compiled.outputText + '\n})', {
    filename: 'catalog.compiled.cjs',
    timeout: 1000,
  }).runInNewContext({})(module, module.exports);
  return module.exports;
}

test('freight and professional contract actions remain separate', () => {
  const { profiles, routeCopy } = loadCatalog();
  const company = profiles.empresa.actions;
  const freight = company.find(a => a.label === 'Publicar frete');
  const driver = company.find(a => a.label === 'Contratar motorista');
  const helper = company.find(a => a.label === 'Contratar ajudante');
  assert.ok(freight && driver && helper);
  assert.equal(freight.route, 'fretes');
  assert.equal(driver.route, 'contratos-motorista');
  assert.equal(helper.route, 'contratos-ajudante');
  assert.equal(new Set([freight.route, driver.route, helper.route]).size, 3);
  for (const profile of ['motorista', 'ajudante']) {
    assert.ok(profiles[profile].actions.every(a => a.route !== 'fretes'));
  }
  for (const route of [freight.route, driver.route, helper.route]) {
    assert.match(routeCopy[route].description, /implementaç[aã]o/i);
  }
});

test('every catalog action points to a defined placeholder and has a unique label per profile', () => {
  const { profiles, routeCopy } = loadCatalog();
  assert.deepEqual(Object.keys(profiles).sort(), ['ajudante', 'caminhoneiro', 'empresa', 'motorista']);
  for (const [name, profile] of Object.entries(profiles)) {
    assert.ok(profile.title.trim() && profile.description.trim(), name);
    assert.ok(profile.actions.length > 0, name);
    assert.equal(new Set(profile.actions.map(a => a.label)).size, profile.actions.length, name);
    for (const action of profile.actions) {
      assert.ok(action.label.trim(), name);
      assert.ok(routeCopy[action.route], name + ': ' + action.route);
      assert.ok(routeCopy[action.route].title.trim());
    }
  }
});
