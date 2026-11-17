import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { checkHealth } from '../scripts/smoke-health.mjs';

// Real loopback HTTP integration tests. No external network or production data.
async function withServer(handler, run) {
  const server = createServer(handler);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
}

test('real HTTP smoke accesses only the fixed public health route', async () => {
  const paths = [];
  await withServer((req, res) => {
    paths.push(req.url);
    assert.equal(req.method, 'GET');
    assert.equal(req.headers.accept, 'application/json');
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'logistica-unificada' }));
  }, async origin => {
    assert.equal(await checkHealth(`${origin}/private?token=do-not-send`), true);
  });
  assert.deepEqual(paths, ['/api/health']);
});

test('real HTTP smoke rejects redirects without following their destination', async () => {
  const paths = [];
  await withServer((req, res) => {
    paths.push(req.url);
    res.writeHead(302, { location: '/private' });
    res.end();
  }, async origin => {
    await assert.rejects(checkHealth(origin));
  });
  assert.deepEqual(paths, ['/api/health']);
});

test('real HTTP smoke rejects malformed JSON and an unexpected service', async () => {
  await withServer((req, res) => {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end('not valid JSON');
  }, async origin => {
    await assert.rejects(checkHealth(origin));
  });
  await withServer((req, res) => {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'other' }));
  }, async origin => {
    await assert.rejects(checkHealth(origin), /mismatch/);
  });
});

test('real HTTP smoke rejects non-200 status even when body looks healthy', async () => {
  await withServer((req, res) => {
    res.writeHead(503, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'logistica-unificada' }));
  }, async origin => {
    await assert.rejects(checkHealth(origin), /non-200/);
  });
});
