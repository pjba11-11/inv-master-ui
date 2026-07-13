// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { authHeaders, backendFetch, backendUrl, decodeJwtPayload } from './backend';

function requestWithCookies(cookie?: string) {
  return new NextRequest('http://localhost:3000/api/test', {
    headers: cookie ? { cookie } : {},
  });
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('backendUrl', () => {
  it('prefixes the backend host', () => {
    expect(backendUrl('/materials')).toBe('http://localhost:8080/materials');
  });
});

describe('authHeaders', () => {
  it('builds JSON + bearer headers', () => {
    expect(authHeaders('tok')).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer tok',
    });
  });
});

describe('decodeJwtPayload', () => {
  it('decodes the base64url payload segment', () => {
    const payload = Buffer.from(JSON.stringify({ sub: 'a@b.com', role: 'ROLE_ADMIN' }))
      .toString('base64url');
    expect(decodeJwtPayload(`header.${payload}.sig`)).toEqual({
      sub: 'a@b.com',
      role: 'ROLE_ADMIN',
    });
  });
});

describe('backendFetch', () => {
  it('returns 401 without calling the backend when no auth cookie exists', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const res = await backendFetch('/materials', { method: 'GET' }, requestWithCookies());

    expect(res.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends the access token as a bearer header on the happy path', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([{ id: 1 }]));
    vi.stubGlobal('fetch', fetchMock);
    const outResponse = { headers: new Headers() };

    const res = await backendFetch(
      '/materials',
      { method: 'GET' },
      requestWithCookies('auth_token=at1; refresh_token=rt1'),
      outResponse,
    );

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const headers = fetchMock.mock.calls[0][1].headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer at1');
    expect(outResponse.headers.getSetCookie()).toHaveLength(0);
  });

  it('refreshes on 401, retries, and rotates both cookies', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ error: 'expired' }, 401))
      .mockResolvedValueOnce(jsonResponse({ accessToken: 'at2', refreshToken: 'rt2' }))
      .mockResolvedValueOnce(jsonResponse([{ id: 1 }]));
    vi.stubGlobal('fetch', fetchMock);
    const outResponse = { headers: new Headers() };

    const res = await backendFetch(
      '/materials',
      { method: 'GET' },
      requestWithCookies('auth_token=at1; refresh_token=rt1'),
      outResponse,
    );

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(3);

    const refreshCall = fetchMock.mock.calls[1];
    expect(refreshCall[0]).toBe('http://localhost:8080/auth/refresh');
    expect(refreshCall[1].body).toContain('rt1');

    const retryHeaders = fetchMock.mock.calls[2][1].headers as Record<string, string>;
    expect(retryHeaders.Authorization).toBe('Bearer at2');

    const cookies = outResponse.headers.getSetCookie();
    expect(cookies).toHaveLength(2);
    expect(cookies[0]).toContain('auth_token=at2');
    expect(cookies[0]).toContain('HttpOnly');
    expect(cookies[0]).toContain('Max-Age=28800');
    expect(cookies[1]).toContain('refresh_token=rt2');
    expect(cookies[1]).toContain('Max-Age=604800');
  });

  it('returns the original 401 when the refresh call fails', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ error: 'expired' }, 401))
      .mockResolvedValueOnce(jsonResponse({ error: 'invalid refresh' }, 400));
    vi.stubGlobal('fetch', fetchMock);
    const outResponse = { headers: new Headers() };

    const res = await backendFetch(
      '/materials',
      { method: 'GET' },
      requestWithCookies('auth_token=at1; refresh_token=rt1'),
      outResponse,
    );

    expect(res.status).toBe(401);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(outResponse.headers.getSetCookie()).toHaveLength(0);
  });

  it('sets only the auth cookie when no rotated refresh token is returned', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ error: 'expired' }, 401))
      .mockResolvedValueOnce(jsonResponse({ accessToken: 'at2' }))
      .mockResolvedValueOnce(jsonResponse([{ id: 1 }]));
    vi.stubGlobal('fetch', fetchMock);
    const outResponse = { headers: new Headers() };

    await backendFetch(
      '/materials',
      { method: 'GET' },
      requestWithCookies('auth_token=at1; refresh_token=rt1'),
      outResponse,
    );

    const cookies = outResponse.headers.getSetCookie();
    expect(cookies).toHaveLength(1);
    expect(cookies[0]).toContain('auth_token=at2');
  });

  it('does not attempt a refresh without a refresh token cookie', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ error: 'expired' }, 401));
    vi.stubGlobal('fetch', fetchMock);

    const res = await backendFetch(
      '/materials',
      { method: 'GET' },
      requestWithCookies('auth_token=at1'),
    );

    expect(res.status).toBe(401);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
