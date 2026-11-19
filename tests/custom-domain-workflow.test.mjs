import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../.github/workflows/external-health.yml', import.meta.url), 'utf8');

test('public endpoints have separate independently reported GitHub Actions jobs', () => {
  const jobsSection = workflow.split(/^jobs:\s*$/m)[1];
  assert.ok(jobsSection, 'workflow declares jobs section');
  const jobs = jobsSection.split(/^  (?=[a-z][a-z-]*:\s*$)/m).filter((part) => /^([a-z][a-z-]*):\s*$/m.test(part.split('\n')[0]));
  assert.equal(jobs.length, 2, 'exactly two independently reported health jobs');
  const [railway, custom] = jobs;
  assert.match(railway, /^railway-health:\s*$/m);
  assert.match(custom, /^custom-domain-health:\s*$/m);
  assert.match(railway, /SMOKE_BASE_URL: https:\/\/logistica-web-production-cfbeefaa\.up\.railway\.app/);
  assert.match(custom, /SMOKE_BASE_URL: https:\/\/lu\.predibeacon\.com/);
  for (const job of jobs) {
    assert.equal((job.match(/run: node scripts\/smoke-health\.mjs/g) || []).length, 1);
    assert.match(job, /timeout-minutes: 5/);
    assert.doesNotMatch(job, /continue-on-error:\s*true/);
    assert.doesNotMatch(job, /\$\{\{\s*secrets\./i);
  }
});

test('health workflow keeps least privilege, scheduled execution and manual dispatch', () => {
  assert.match(workflow, /^permissions:\s*\n\s+contents: read\s*$/m);
  assert.match(workflow, /^\s+- cron: ['"]17 \* \* \* \*['"]\s*$/m);
  assert.match(workflow, /^\s+workflow_dispatch:\s*$/m);
  assert.doesNotMatch(workflow, /continue-on-error:\s*true/);
});
