import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

function normalizeInvoice(inv: Record<string, unknown>) {
  if ('invoiceId' in inv && !('id' in inv)) {
    return { ...inv, id: inv.invoiceId };
  }
  return inv;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const outResponse = new NextResponse();
  const res = await backendFetch(`/invoices/${id}`, { method: 'GET' }, request, outResponse);
  const data = await res.json();
  return NextResponse.json(normalizeInvoice(data), { status: res.status, headers: outResponse.headers });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const outResponse = new NextResponse();
  const res = await backendFetch(`/invoices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  }, request, outResponse);
  const data = await res.json();
  return NextResponse.json(normalizeInvoice(data), { status: res.status, headers: outResponse.headers });
}
