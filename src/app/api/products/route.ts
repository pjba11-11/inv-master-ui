import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

interface ProductRecord {
  productName?: string;
  description?: string;
  active?: boolean;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  const resHeaders = new Headers();
  const res = await backendFetch('/products', {}, request, { headers: resHeaders });
  const data = await res.json();

  if (!res.ok) return NextResponse.json(data, { status: res.status, headers: resHeaders });

  const search = request.nextUrl.searchParams.get('search')?.toLowerCase();
  const active = request.nextUrl.searchParams.get('active');

  let result: ProductRecord[] = data;
  if (search) {
    result = result.filter((p) =>
      p.productName?.toLowerCase().includes(search) ||
      p.description?.toLowerCase().includes(search)
    );
  }
  if (active !== null) {
    result = result.filter((p) => p.active === (active === 'true'));
  }

  return NextResponse.json(result, { headers: resHeaders });
}

export async function POST(request: NextRequest) {
  const resHeaders = new Headers();
  const body = await request.json();

  const res = await backendFetch('/products', {
    method: 'POST',
    body: JSON.stringify(body),
  }, request, { headers: resHeaders });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status, headers: resHeaders });
}
