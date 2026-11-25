import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const derive = promisify(scrypt);
const options = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
function valid(password) {
  return typeof password === 'string' && password.length > 0 && Buffer.byteLength(password, 'utf8') <= 1024;
}
// Server-only credential primitive; no account policy or live registration.
export async function hashPassword(password) {
  if (!valid(password)) throw new TypeError('Invalid password input');
  const salt = randomBytes(16);
  const key = await derive(password, salt, 32, options);
  return 'scrypt-v1:' + salt.toString('hex') + ':' + key.toString('hex');
}
export async function verifyPassword(password, stored) {
  if (!valid(password) || typeof stored !== 'string' || stored.length !== 107) return false;
  const match = /^scrypt-v1:([0-9a-f]{32}):([0-9a-f]{64})$/.exec(stored);
  if (!match) return false;
  const key = await derive(password, Buffer.from(match[1], 'hex'), 32, options);
  return timingSafeEqual(key, Buffer.from(match[2], 'hex'));
}
