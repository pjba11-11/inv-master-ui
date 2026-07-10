import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const outResponse = new NextResponse();
  const res = await backendFetch(`/invoices/${id}/payments`, { method: 'GET' }, request, outResponse);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status, headers: outResponse.headers });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const outResponse = new NextResponse();
  const res = await backendFetch(`/invoices/${id}/payments`, {
    method: 'POST',
    body: JSON.stringify(body),
  }, request, outResponse);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status, headers: outResponse.headers });
}
