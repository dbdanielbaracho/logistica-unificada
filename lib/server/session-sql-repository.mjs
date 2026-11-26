// PostgreSQL adapter; injected query client, no connection or production activation.
export function createSqlSessionRepository(client) {
  if (typeof client?.query !== 'function') throw new TypeError('Invalid SQL client');
  return {
    async insert(record) {
      await client.query(
        'INSERT INTO auth_sessions (digest, user_id, created_at, expires_at, revoked_at) VALUES ($1, $2, $3, $4, $5)',
        [record.digest, record.userId, record.createdAt, record.expiresAt, record.revokedAt]);
    },
    async findByDigest(digest) {
      const { rows } = await client.query(
        'SELECT digest, user_id, created_at, expires_at, revoked_at FROM auth_sessions WHERE digest = $1', [digest]);
      if (rows.length !== 1) return null;
      const row = rows[0];
      const millis = value => {
        if (typeof value === 'number') return Number.isSafeInteger(value) ? value : NaN;
        if (typeof value !== 'string' || !/^\d+$/.test(value)) return NaN;
        const n = Number(value);
        return Number.isSafeInteger(n) ? n : NaN;
      };
      return { digest: row.digest, userId: row.user_id, createdAt: millis(row.created_at),
        expiresAt: millis(row.expires_at), revokedAt: row.revoked_at === null ? null : millis(row.revoked_at) };
    },
    async revokeByDigest(digest, now) {
      await client.query('UPDATE auth_sessions SET revoked_at = $2 WHERE digest = $1 AND revoked_at IS NULL', [digest, now]);
    }
  };
}
