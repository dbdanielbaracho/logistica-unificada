import { randomBytes, createHash } from 'node:crypto';

// Store only the digest; the bearer token must never enter logs or persistence.
export function digestSessionToken(token) {
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const bytes = Buffer.from(token, 'base64url');
  if (bytes.length !== 32 || bytes.toString('base64url') !== token) return null;
  return createHash('sha256').update(bytes).digest('hex');
}

export function createSessionToken() {
  const token = randomBytes(32).toString('base64url');
  return { token, digest: digestSessionToken(token) };
}
