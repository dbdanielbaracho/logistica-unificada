import { pathToFileURL } from 'node:url';

// Fixed, synthetic probes only. Never fetch secrets or print response bodies.
export const SENSITIVE_PATHS = Object.freeze(['/.env', '/.git/HEAD', '/.openai/credentials.json']);

export async function checkPublicSensitivePaths(baseUrl, fetcher = fetch) {
  const origin = new URL(baseUrl);
  if (origin.protocol !== 'https:' || origin.username || origin.password ||
      origin.pathname !== '/' || origin.search || origin.hash) {
    throw new Error('Expected a bare HTTPS origin without credentials');
  }
  for (const path of SENSITIVE_PATHS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetcher(new URL(path, origin), {
        method: 'GET', signal: controller.signal, redirect: 'error', cache: 'no-store',
      });
      if (response.status !== 404) {
        throw new Error('Unexpected status for protected path: ' + path + ' (' + response.status + ')');
      }
      // Do not inspect or log the body: only the HTTP status is asserted.
      await response.body?.cancel?.();
    } finally {
      clearTimeout(timer);
    }
  }
  return true;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!process.env.SMOKE_BASE_URL) {
    console.error('SMOKE_BASE_URL is required');
    process.exitCode = 2;
  } else {
    try {
      await checkPublicSensitivePaths(process.env.SMOKE_BASE_URL);
      console.log('Public sensitive-path status checks passed');
    } catch (error) {
      console.error('Public sensitive-path check failed:', error instanceof Error ? error.message : 'unknown error');
      process.exitCode = 1;
    }
  }
}
