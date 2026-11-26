import test from 'node:test';
import assert from 'node:assert/strict';
import { createSessionService } from '../lib/server/session-lifecycle.mjs';
import { digestSessionToken } from '../lib/server/session-token.mjs';

function setup() {
  const records = new Map();
  let time = 1000;
  const repository = {
    async insert(record) { assert.ok(!records.has(record.digest)); records.set(record.digest, record); },
    async findByDigest(digest) { return records.get(digest); },
    async revokeByDigest(digest, now) {
      const record = records.get(digest);
      if (record && record.revokedAt === null) record.revokedAt = now;
    }
  };
  return { records, setTime: value => { time = value; },
    service: createSessionService(repository, { ttlMs: 100, clock: () => time }) };
}

test('30 synthetic users: issue, resolve, isolate, expire at exact boundary', async () => {
  const { service, records, setTime } = setup();
  const sessions = [];
  for (let i = 0; i < 30; i++) {
    const userId = 'fixture-user-' + i;
    const session = await service.issue(userId);
    sessions.push(session);
    assert.deepEqual(await service.resolve(session.token), { userId, expiresAt: 1100 });
    assert.ok(!JSON.stringify([...records.values()]).includes(session.token));
  }
  assert.equal(records.size, 30);
  setTime(1099);
  assert.ok(await service.resolve(sessions[0].token));
  setTime(1100);
  for (const session of sessions) assert.equal(await service.resolve(session.token), null);
});

test('revocation is idempotent and isolates sessions', async () => {
  const { service, records, setTime } = setup();
  const a = await service.issue('fixture-a');
  const b = await service.issue('fixture-b');
  await service.revoke(a.token);
  setTime(1001);
  await service.revoke(a.token);
  assert.equal(records.get(digestSessionToken(a.token)).revokedAt, 1000);
  assert.equal(await service.resolve(a.token), null);
  assert.ok(await service.resolve(b.token));
});

test('invalid input and malformed stored records fail closed', async () => {
  const { service, records, setTime } = setup();
  for (const token of [null, 1, '', 'invalid']) {
    assert.equal(await service.resolve(token), null);
    await service.revoke(token);
  }
  await assert.rejects(service.issue(' '), TypeError);
  assert.throws(() => createSessionService({}, { ttlMs: 0 }), TypeError);
  const a = await service.issue('fixture-a');
  setTime(999);
  assert.equal(await service.resolve(a.token), null);
  setTime(1000);
  records.get(digestSessionToken(a.token)).expiresAt = NaN;
  assert.equal(await service.resolve(a.token), null);
});
