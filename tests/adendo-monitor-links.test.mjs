import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const path = resolve(root, 'docs/adendos/AT-2026-11-19-01-monitor-dominio.md');
const markdown = readFileSync(path, 'utf8');

test('versioned monitoring addendum keeps working local documentation links', () => {
  const links = [...markdown.matchAll(/\\[[^\\]]+\\]\\(([^)]+)\\)/g)]
    .map((match) => match[1]).filter((href) => !/^(https?:|#)/i.test(href));
  assert.ok(links.length >= 3, 'expected references to runbook, workflow and implementation');
  for (const href of links) {
    assert.ok(!href.includes('..\\\\'), 'unsafe backslash path');
    const target = resolve(dirname(path), decodeURIComponent(href.split('#')[0]));
    assert.ok(target.startsWith(root), 'link must stay within repository');
    assert.ok(existsSync(target), 'missing local reference: ' + href);
  }
});
