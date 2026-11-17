import { pathToFileURL } from 'node:url';

/** Public health contract only; never accesses personal data or financial routes. */
export async function checkHealth(baseUrl, fetcher = fetch) {
  // Validate the configured origin before constructing the fixed public endpoint.
  // Do not allow URL userinfo, which can accidentally disclose credentials.
  const origin = new URL(baseUrl);
  if (!['https:', 'http:'].includes(origin.protocol)) throw new Error('Unsupported protocol');
  if (origin.username || origin.password) throw new Error('Credentials are not allowed in health URL');
  const target = new URL('/api/health', origin);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetcher(target, { signal: controller.signal, redirect: 'error', headers: { accept: 'application/json' } });
    if (response.status !== 200) throw new Error('Health check returned non-200 status');
    const type = response.headers.get('content-type') ?? '';
    if (!type.toLowerCase().includes('application/json')) throw new Error('Health check returned non-JSON response');
    const data = await response.json();
    if (data?.status !== 'ok' || data?.service !== 'logistica-unificada') throw new Error('Health contract mismatch');
    return true;
  } finally {
    clearTimeout(timeout);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const baseUrl = process.env.SMOKE_BASE_URL;
  if (!baseUrl) {
    console.error('SMOKE_BASE_URL is required.');
    process.exitCode = 2;
  } else {
    try {
      await checkHealth(baseUrl);
      console.log('Health smoke passed.');
    } catch (error) {
      console.error('Health smoke failed:', error instanceof Error ? error.message : 'unknown error');
      process.exitCode = 1;
    }
  }
}
