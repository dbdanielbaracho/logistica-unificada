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
  assert.equal((compiled.diagnostics ?? []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
  const module = { exports: {} };
  new Script('(function(module, exports) { ' + compiled.outputText + '\n})', {
    filename: 'catalog.compiled.cjs', timeout: 1000,
  }).runInNewContext({})(module, module.exports);
  return module.exports;
}

test('every catalog destination explicitly remains an unimplemented placeholder', () => {
  const { profiles, routeCopy } = loadCatalog();
  const routes = new Set(Object.values(profiles).flatMap(profile => profile.actions.map(action => action.route)));
  assert.deepEqual([...routes].sort(), Object.keys(routeCopy).sort(),
    'all advertised routes must be accounted for');
  for (const route of routes) {
    assert.match(routeCopy[route].description, /funcionalidade em implementaç[aã]o/i,
      route + ' must not imply an operational or approved service');
  }
});

test('navigation catalog does not advertise real financial operations', () => {
  const { profiles, routeCopy } = loadCatalog();
  const actionLabels = Object.values(profiles).flatMap(profile => profile.actions.map(action => action.label));
  const prohibited = /(?:pagar|receber pagamento|transferir|sacar|antecipar|carteira|escrow|checkout|pix|cobrar taxa)/i;
  for (const label of actionLabels) {
    assert.doesNotMatch(label, prohibited, 'financial action requires contract and homologation');
  }
  for (const [route, copy] of Object.entries(routeCopy)) {
    assert.doesNotMatch(copy.title, prohibited, route);
  }
});
