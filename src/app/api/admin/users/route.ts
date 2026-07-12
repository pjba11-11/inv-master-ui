import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

export async function GET(request: NextRequest) {
  const outResponse = new NextResponse();
  const res = await backendFetch('/admin/users', { method: 'GET' }, request, outResponse);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status, headers: outResponse.headers });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const outResponse = new NextResponse();
  const res = await backendFetch('/admin/users', {
    method: 'POST',
    body: JSON.stringify(body),
  }, request, outResponse);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status, headers: outResponse.headers });
}
