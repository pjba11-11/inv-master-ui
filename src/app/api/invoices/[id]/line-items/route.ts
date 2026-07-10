import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const outResponse = new NextResponse();
  const res = await backendFetch(`/invoices/${id}/line-items`, { method: 'GET' }, request, outResponse);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status, headers: outResponse.headers });
}
