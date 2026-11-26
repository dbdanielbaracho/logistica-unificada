import { createSessionToken, digestSessionToken } from './session-token.mjs';

// Repository contract: insert(record), findByDigest(digest), revokeByDigest(digest, now).
// Implementations must enforce unique digests and atomic, idempotent revocation.
export function createSessionService(repository, { ttlMs, clock = Date.now } = {}) {
  if (!Number.isSafeInteger(ttlMs) || ttlMs <= 0) throw new TypeError('Invalid session TTL');
  function now() {
    const value = clock();
    if (!Number.isSafeInteger(value) || value < 0) throw new TypeError('Invalid clock');
    return value;
  }
  return {
    async issue(userId) {
      if (typeof userId !== 'string' || !userId.trim()) throw new TypeError('Invalid user ID');
      const createdAt = now();
      const expiresAt = createdAt + ttlMs;
      if (!Number.isSafeInteger(expiresAt)) throw new RangeError('Invalid expiry');
      const { token, digest } = createSessionToken();
      await repository.insert({ digest, userId, createdAt, expiresAt, revokedAt: null });
      return { token, expiresAt };
    },
    async resolve(token) {
      const digest = digestSessionToken(token);
      if (!digest) return null;
      const record = await repository.findByDigest(digest);
      const time = now();
      if (!record || record.digest !== digest || record.revokedAt !== null ||
          !Number.isSafeInteger(record.createdAt) || !Number.isSafeInteger(record.expiresAt) ||
          time < record.createdAt || time >= record.expiresAt ||
          typeof record.userId !== 'string' || !record.userId.trim()) return null;
      return { userId: record.userId, expiresAt: record.expiresAt };
    },
    async revoke(token) {
      const digest = digestSessionToken(token);
      if (!digest) return;
      await repository.revokeByDigest(digest, now());
    }
  };
}
