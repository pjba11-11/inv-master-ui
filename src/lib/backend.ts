import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080';

export function backendUrl(path: string) {
  return `${BACKEND_URL}${path}`;
}

export function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export function decodeJwtPayload(token: string): Record<string, unknown> {
  const segment = token.split('.')[1];
  const padded = segment.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
}

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(backendUrl('/auth/refresh'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const { accessToken } = await res.json();
    return accessToken ?? null;
  } catch {
    return null;
  }
}

/**
 * Makes an authenticated request to the backend.
 * If the access token is expired (401), auto-refreshes using the refresh token cookie and retries once.
 * Attaches Set-Cookie headers to `outResponse` when a new access token is issued.
 */
export async function backendFetch(
  path: string,
  options: RequestInit,
  request: NextRequest,
  outResponse?: { headers: Headers },
): Promise<Response> {
  const accessToken = request.cookies.get('auth_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  let res = await fetch(backendUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401 && refreshToken) {
    const newAccessToken = await refreshAccessToken(refreshToken);
    if (newAccessToken) {
      res = await fetch(backendUrl(path), {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      });

      // Propagate the new token as a cookie via outResponse headers
      if (outResponse) {
        const cookieValue = `auth_token=${newAccessToken}; HttpOnly; Path=/; Max-Age=${60 * 60 * 8}; SameSite=Lax`;
        outResponse.headers.set('Set-Cookie', cookieValue);
      }
    }
  }

  return res;
}
