import { pathToFileURL } from 'node:url';

export const REQUIRED_HEADERS = Object.freeze({
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'DENY',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
});

/** Read only public /api/health headers. No cookies, credentials, body or personal data. */
export async function checkPublicSecurityHeaders(baseUrl, fetcher = fetch) {
  const origin = new URL(baseUrl);
  if (!['https:', 'http:'].includes(origin.protocol)) throw new Error('Unsupported protocol');
  if (origin.username || origin.password) throw new Error('Credentials not allowed');
  if (origin.pathname !== '/' || origin.search || origin.hash) throw new Error('Expected a bare origin');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetcher(new URL('/api/health', origin), {
      signal: controller.signal, redirect: 'error', cache: 'no-store',
      headers: { accept: 'application/json' },
    });
    if (response.status !== 200) throw new Error('Public health endpoint is not HTTP 200');
    for (const [name, expected] of Object.entries(REQUIRED_HEADERS)) {
      const actual = response.headers.get(name);
      if (actual !== expected) throw new Error('Missing or unexpected security header: ' + name);
    }
    return true;
  } finally {
    clearTimeout(timeout);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const baseUrl = process.env.SMOKE_BASE_URL;
  if (!baseUrl) {
    console.error('SMOKE_BASE_URL is required');
    process.exitCode = 2;
  } else {
    try {
      await checkPublicSecurityHeaders(baseUrl);
      console.log('Public security headers passed');
    } catch (error) {
      console.error('Public security headers failed:', error instanceof Error ? error.message : 'unknown error');
      process.exitCode = 1;
    }
  }
}
