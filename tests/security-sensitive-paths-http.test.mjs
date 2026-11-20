import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { checkSensitivePaths, sensitivePaths } from '../scripts/check-sensitive-paths.mjs';

async function withServer(handler, run) {
  const server = createServer(handler);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    await run(`http://127.0.0.1:${server.address().port}/`);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
}

test('isolated HTTP server denies every representative sensitive path', async () => {
  const seen = [];
  await withServer((req, res) => {
    seen.push(req.url);
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('Not Found');
  }, async base => {
    const results = await checkSensitivePaths(base);
    assert.equal(results.length, sensitivePaths.length);
    assert.ok(results.every(result => result.passed));
    assert.deepEqual(seen, sensitivePaths);
  });
});

test('isolated HTTP probe flags 200 and 302 rather than following redirects', async () => {
  await withServer((req, res) => {
    if (req.url === '/.env') {
      res.writeHead(200);
      return res.end('synthetic placeholder');
    }
    if (req.url === '/.git/config') {
      res.writeHead(302, { location: '/somewhere' });
      return res.end();
    }
    res.writeHead(404);
    res.end();
  }, async base => {
    const results = await checkSensitivePaths(base);
    assert.equal(results.find(r => r.path === '/.env').passed, false);
    assert.equal(results.find(r => r.path === '/.git/config').status, 302);
    assert.equal(results.filter(r => !r.passed).length, 2);
    assert.equal(JSON.stringify(results).includes('synthetic placeholder'), false);
  });
});

test('isolated HTTP probe rejects credentials, query, fragments and non-http schemes', async () => {
  for (const url of ['file:///tmp/', 'http://user:pass@localhost/', 'http://localhost/?token=abc', 'http://localhost/#x', 'http://localhost/nested/']) {
    await assert.rejects(checkSensitivePaths(url), /Invalid isolated test base URL/);
  }
});
