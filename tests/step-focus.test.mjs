import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('src/app/page.tsx', 'utf8');

test('step changes focus the active heading without stealing focus on initial load', () => {
  assert.match(page, /const headingRef = useRef<HTMLHeadingElement>\(null\)/);
  assert.match(page, /if \(initialRender\.current\) \{ initialRender\.current = false; return; \}/);
  assert.match(page, /headingRef\.current\?\.focus\(\)/);
  assert.match(page, /\}, \[profile, route\]\)/);
  assert.equal((page.match(/<h1 ref=\{headingRef\} tabIndex=\{-1\}>/g) ?? []).length, 3);
});
