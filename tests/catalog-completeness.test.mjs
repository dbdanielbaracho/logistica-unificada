import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Execute the actual TypeScript catalog; no business behavior is mocked.
const source = readFileSync('src/lib/catalog.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
}).outputText;
const { profiles, routeCopy } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));

test('all placeholder destinations are reachable and clearly unfinished', () => {
  const used = new Set(Object.values(profiles).flatMap(profile => profile.actions.map(action => action.route)));
  assert.deepEqual([...used].sort(), Object.keys(routeCopy).sort(), 'Catalog has orphan or undefined destinations');
  for (const [route, copy] of Object.entries(routeCopy)) {
    assert.ok(copy.title.trim(), `Missing title for ${route}`);
    assert.match(copy.description, /em implementação/i, `Missing unfinished notice for ${route}`);
  }
});

test('visible actions have unambiguous labels within each profile', () => {
  for (const [profile, definition] of Object.entries(profiles)) {
    assert.ok(definition.title.trim(), `Missing title for ${profile}`);
    assert.ok(definition.description.trim(), `Missing description for ${profile}`);
    const labels = definition.actions.map(action => action.label.trim());
    assert.ok(labels.every(Boolean), `Blank action label for ${profile}`);
    assert.equal(new Set(labels).size, labels.length, `Duplicate action label for ${profile}`);
  }
});
