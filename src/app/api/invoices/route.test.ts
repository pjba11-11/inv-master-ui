// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { normalizeInvoice } from '@/lib/normalize';
import { backendFetch } from '@/lib/backend';
import { GET, POST } from './route';

vi.mock('@/lib/backend', () => ({
  backendFetch: vi.fn(),
}));

const backendFetchMock = vi.mocked(backendFetch);

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('normalizeInvoice', () => {
  it('maps invoiceId to id', () => {
    expect(normalizeInvoice({ invoiceId: 5 })).toEqual({ invoiceId: 5, id: 5 });
  });

  it('leaves an existing id untouched', () => {
    expect(normalizeInvoice({ id: 3 })).toEqual({ id: 3 });
    expect(normalizeInvoice({ invoiceId: 5, id: 9 })).toEqual({ invoiceId: 5, id: 9 });
  });
});

describe('invoices route', () => {
  beforeEach(() => {
    backendFetchMock.mockReset();
  });

  it('GET wraps and normalizes the backend list', async () => {
    backendFetchMock.mockResolvedValue(jsonResponse([{ invoiceId: 1 }, { invoiceId: 2 }]));

    const res = await GET(new NextRequest('http://localhost:3000/api/invoices'));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.invoices).toEqual([
      { invoiceId: 1, id: 1 },
      { invoiceId: 2, id: 2 },
    ]);
  });

  it('GET passes non-array error bodies through with the backend status', async () => {
    backendFetchMock.mockResolvedValue(jsonResponse({ error: 'Unauthorized' }, 401));

    const res = await GET(new NextRequest('http://localhost:3000/api/invoices'));
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.invoices).toEqual({ error: 'Unauthorized' });
  });

  it('POST forwards the stringified body and normalizes the created invoice', async () => {
    backendFetchMock.mockResolvedValue(jsonResponse({ invoiceId: 42 }, 201));

    const res = await POST(
      new NextRequest('http://localhost:3000/api/invoices', {
        method: 'POST',
        body: JSON.stringify({ customerId: 1 }),
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body).toEqual({ invoiceId: 42, id: 42 });
    expect(backendFetchMock).toHaveBeenCalledWith(
      '/invoices',
      expect.objectContaining({ method: 'POST', body: '{"customerId":1}' }),
      expect.anything(),
      expect.anything(),
    );
  });
});
