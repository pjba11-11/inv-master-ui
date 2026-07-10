import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

export async function GET(request: NextRequest) {
  const resHeaders = new Headers();
  const res = await backendFetch('/customers', {}, request, { headers: resHeaders });
  const data = await res.json();

  if (!res.ok) return NextResponse.json(data, { status: res.status, headers: resHeaders });

  const search = request.nextUrl.searchParams.get('search')?.toLowerCase();
  let result: any[] = data;
  if (search) {
    result = result.filter((c: any) =>
      c.customerName?.toLowerCase().includes(search) ||
      c.email?.toLowerCase().includes(search) ||
      c.phone?.includes(search)
    );
  }

  return NextResponse.json(result, { headers: resHeaders });
}

export async function POST(request: NextRequest) {
  const resHeaders = new Headers();
  const body = await request.json();

  const res = await backendFetch('/customers', {
    method: 'POST',
    body: JSON.stringify(body),
  }, request, { headers: resHeaders });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status, headers: resHeaders });
}
