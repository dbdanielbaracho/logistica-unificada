import { NextResponse } from 'next/server';

// Availability is an instantaneous signal; caches must not serve stale success.
export function GET() {
  return NextResponse.json(
    { status: 'ok', service: 'logistica-unificada' },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}
