// src/lib/espoFetch.ts
import type { SessionData } from './session';

function normalizeEspoBase(raw: string | undefined | null): string {
  const base = (raw ?? '').trim().replace(/\/+$/, '');
  if (!base) return '';
  return base.endsWith('/api/v1') ? base : `${base}/api/v1`;
}

export async function espoFetch(
  path: string,
  method: string,
  session: SessionData,
  body?: unknown
): Promise<Response> {
  // Server/runtime env (Astro SSR + API routes)
  const rawBase =
    process.env.ESPO_API_BASE ||
    process.env.ESPO_API_URL ||
    '';

  const baseUrl = normalizeEspoBase(rawBase);

  if (!baseUrl) {
    console.error('--- espoFetch ERROR ---');
    console.error('ESPO_API_BASE / ESPO_API_URL is UNDEFINED (server runtime)');
    console.error('Set it in CapRover env vars (recommended: ESPO_API_BASE=http://srv-captain--core-crm-v3/api/v1)');
  }

  // Build URL
  // - If `path` is absolute (http...), use it as-is.
  // - Otherwise ensure it starts with "/"
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = path.startsWith('http') ? path : `${baseUrl}${normalizedPath}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Auth contract for EspoCRM:
  // - Token auth: Espo-Authorization: Bearer <token>
  // - Optional cookie passthrough if you store it
  if (session?.espoToken) {
    headers['Espo-Authorization'] = `Bearer ${session.espoToken}`;
    // hard guarantee: never send the wrong header
    if ('Authorization' in headers) delete headers['Authorization'];
  } else if (session?.espoCookie) {
    headers['Cookie'] = session.espoCookie;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 403) {
    console.warn(`EspoCRM returned 403 for ${url}`);
  }

  return res;
}
