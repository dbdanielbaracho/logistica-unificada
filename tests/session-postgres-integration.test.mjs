import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import pg from 'pg';
import { createSqlSessionRepository } from '../lib/server/session-sql-repository.mjs';
import { createSessionService } from '../lib/server/session-lifecycle.mjs';

test('PostgreSQL migration and 30 synthetic sessions survive reconnect', { skip: process.env.SESSION_TEST_POSTGRES !== '1' }, async () => {
  // Only the dedicated loopback CI database is permitted.
  const config = { host: '127.0.0.1', port: 5432, database: 'session_test', user: 'session_test', password: 'session_test', connectionTimeoutMillis: 5000 };
  const schema = 'fixture_' + randomUUID().replaceAll('-', '');
  const first = new pg.Client(config);
  const second = new pg.Client(config);
  await first.connect();
  try {
    await first.query('CREATE SCHEMA ' + schema);
    await first.query('SET search_path TO ' + schema);
    await first.query(await readFile(new URL('../db/migrations/001_auth_sessions.sql', import.meta.url), 'utf8'));
    let now = 1000;
    const service = client => createSessionService(createSqlSessionRepository(client), { ttlMs: 100, clock: () => now });
    const sessions = [];
    for (let i = 0; i < 30; i++) sessions.push(await service(first).issue('fixture-user-' + i));
    await second.connect();
    await second.query('SET search_path TO ' + schema);
    const persisted = service(second);
    for (let i = 0; i < 30; i++) assert.deepEqual(await persisted.resolve(sessions[i].token), { userId: 'fixture-user-' + i, expiresAt: 1100 });
    const { rows } = await second.query('SELECT digest FROM auth_sessions');
    assert.equal(rows.length, 30);
    assert.ok(rows.every(row => /^[0-9a-f]{64}$/.test(row.digest) && !sessions.some(s => s.token === row.digest)));
    await persisted.revoke(sessions[0].token);
    now++;
    await persisted.revoke(sessions[0].token);
    assert.equal(await service(first).resolve(sessions[0].token), null);
    assert.equal((await first.query('SELECT revoked_at FROM auth_sessions WHERE revoked_at IS NOT NULL')).rows[0].revoked_at, '1000');
    assert.equal(await persisted.resolve('invalid'), null);
    now = 1100;
    for (const session of sessions) assert.equal(await persisted.resolve(session.token), null);
  } finally {
    await second.end();
    await first.end();
    // Ephemeral CI database is discarded by the service container.
  }
});
