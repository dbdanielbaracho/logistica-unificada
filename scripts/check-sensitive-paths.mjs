// Isolated HTTP regression helper. No public requests unless explicitly invoked by caller.
export const sensitivePaths = Object.freeze([
  '/.env', '/.env.local', '/.git/config', '/.vscode/sftp.json',
  '/service_account.json', '/config/local.json', '/.aws/credentials',
]);

export async function checkSensitivePaths(baseUrl, { fetchImpl = fetch, timeoutMs = 5000 } = {}) {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 30000) {
    throw new RangeError('timeoutMs must be an integer from 1 to 30000');
  }
  const base = new URL(baseUrl);
  if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password ||
      base.search || base.hash || base.pathname !== '/') {
    throw new Error('Invalid isolated test base URL');
  }
  const results = [];
  for (const path of sensitivePaths) {
    const response = await fetchImpl(new URL(path, base), {
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(timeoutMs),
    });
    // Do not read or log response bodies: they might contain actual credentials.
    try {
      results.push({ path, status: response.status, passed: response.status === 404 });
    } finally {
      await response.body?.cancel().catch(() => {});
    }
  }
  return results;
}
