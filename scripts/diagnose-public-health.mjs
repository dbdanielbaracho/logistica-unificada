import { lookup } from 'node:dns/promises';
import { pathToFileURL } from 'node:url';
import { checkHealth } from './smoke-health.mjs';

/** Diagnostics for the public health endpoint only; never query private application routes. */
export async function diagnosePublicHealth(baseUrl, resolver = lookup, checker = checkHealth) {
  const origin = new URL(baseUrl);
  if (!['http:', 'https:'].includes(origin.protocol)) throw new Error('Unsupported protocol');
  if (origin.username || origin.password) throw new Error('Credentials are not allowed in health URL');
  const hostname = origin.hostname;
  try {
    await resolver(hostname);
  } catch (error) {
    return { phase: 'dns', ok: false, hostname, code: error?.code ?? 'UNKNOWN' };
  }
  try {
    await checker(baseUrl);
    return { phase: 'http', ok: true, hostname };
  } catch (error) {
    return { phase: 'http', ok: false, hostname, code: error?.code ?? error?.name ?? 'UNKNOWN' };
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!process.env.SMOKE_BASE_URL) {
    console.error('SMOKE_BASE_URL is required');
    process.exitCode = 2;
  } else {
    try {
      const result = await diagnosePublicHealth(process.env.SMOKE_BASE_URL);
      console.log(JSON.stringify(result));
      if (!result.ok) process.exitCode = 1;
    } catch (error) {
      console.error('Diagnostic configuration invalid:', error instanceof Error ? error.message : 'unknown');
      process.exitCode = 2;
    }
  }
}
