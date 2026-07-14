import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

export async function GET(request: NextRequest) {
  const outResponse = new NextResponse();
  const res = await backendFetch('/dashboard', { method: 'GET' }, request, outResponse);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status, headers: outResponse.headers });
}
