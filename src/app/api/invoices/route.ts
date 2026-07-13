import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';
import { normalizeInvoice } from '@/lib/normalize';

export async function GET(request: NextRequest) {
  const outResponse = new NextResponse();
  const res = await backendFetch('/invoices', { method: 'GET' }, request, outResponse);
  const data = await res.json();
  const list = Array.isArray(data) ? data.map(normalizeInvoice) : data;
  return NextResponse.json({ invoices: list }, { status: res.status, headers: outResponse.headers });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const outResponse = new NextResponse();
  const res = await backendFetch('/invoices', {
    method: 'POST',
    body: JSON.stringify(body),
  }, request, outResponse);
  const data = await res.json();
  return NextResponse.json(normalizeInvoice(data), { status: res.status, headers: outResponse.headers });
}
