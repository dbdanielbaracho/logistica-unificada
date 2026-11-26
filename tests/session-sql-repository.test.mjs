import test from 'node:test';
import assert from 'node:assert/strict';
import { createSqlSessionRepository } from '../lib/server/session-sql-repository.mjs';
import { createSessionService } from '../lib/server/session-lifecycle.mjs';

test('30 synthetic sessions through SQL adapter and lifecycle with isolated query double', async () => {
  const rows = new Map();
  const client = { async query(sql, args) {
    assert.ok(sql.includes('$1'));
    if (sql.startsWith('INSERT')) {
      const [digest, user_id, created_at, expires_at, revoked_at] = args;
      if (rows.has(digest)) throw new Error('duplicate');
      rows.set(digest, { digest, user_id, created_at: String(created_at), expires_at: String(expires_at), revoked_at });
    } else if (sql.startsWith('SELECT')) {
      return { rows: rows.has(args[0]) ? [rows.get(args[0])] : [] };
    } else if (sql.startsWith('UPDATE')) {
      assert.ok(sql.includes('revoked_at IS NULL'));
      const row = rows.get(args[0]);
      if (row && row.revoked_at === null) row.revoked_at = String(args[1]);
    } else throw new Error('unexpected query');
    return { rows: [] };
  }};
  let time = 1000;
  const service = createSessionService(createSqlSessionRepository(client), { ttlMs: 100, clock: () => time });
  const sessions = [];
  for (let i = 0; i < 30; i++) {
    const userId = "fixture-user-" + i + "';--";
    const session = await service.issue(userId);
    sessions.push(session);
    assert.deepEqual(await service.resolve(session.token), { userId, expiresAt: 1100 });
    assert.ok(!JSON.stringify([...rows.values()]).includes(session.token));
  }
  await service.revoke(sessions[0].token);
  time++;
  await service.revoke(sessions[0].token);
  assert.equal([...rows.values()][0].revoked_at, '1000');
  assert.equal(await service.resolve(sessions[0].token), null);
  assert.ok(await service.resolve(sessions[1].token));
  time = 1100;
  for (const session of sessions) assert.equal(await service.resolve(session.token), null);
});

test('missing, ambiguous and malformed rows; query errors propagate', async () => {
  assert.throws(() => createSqlSessionRepository(null), TypeError);
  for (const rows of [[], [{}, {}]]) {
    assert.equal(await createSqlSessionRepository({ query: async () => ({ rows }) }).findByDigest('x'), null);
  }
  const repo = createSqlSessionRepository({ query: async () => ({ rows: [{ created_at: '9007199254740992', expires_at: null, revoked_at: null }] }) });
  const record = await repo.findByDigest('x');
  assert.ok(Number.isNaN(record.createdAt));
  assert.ok(Number.isNaN(record.expiresAt));
  await assert.rejects(createSqlSessionRepository({ query: async () => { throw new Error('offline'); } }).findByDigest('x'), /offline/);
});
