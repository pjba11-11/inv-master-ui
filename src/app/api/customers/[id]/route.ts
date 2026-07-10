import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resHeaders = new Headers();
  const res = await backendFetch(`/customers/${id}`, {}, request, { headers: resHeaders });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status, headers: resHeaders });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resHeaders = new Headers();
  const body = await request.json();
  const res = await backendFetch(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  }, request, { headers: resHeaders });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status, headers: resHeaders });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resHeaders = new Headers();
  const res = await backendFetch(`/customers/${id}`, { method: 'DELETE' }, request, { headers: resHeaders });
  if (res.status === 204) return NextResponse.json({ message: 'Customer deleted' }, { headers: resHeaders });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status, headers: resHeaders });
}
