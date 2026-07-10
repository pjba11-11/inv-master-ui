import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

// Backend derives company from JWT — URL company ID is not forwarded
export async function GET(request: NextRequest) {
  const resHeaders = new Headers();
  const res = await backendFetch('/api/company/settings', {}, request, { headers: resHeaders });

  if (res.status === 404) return NextResponse.json(null, { status: 404, headers: resHeaders });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status, headers: resHeaders });
}

export async function POST(request: NextRequest) {
  const resHeaders = new Headers();
  const body = await request.json();

  const res = await backendFetch('/api/company/settings', {
    method: 'POST',
    body: JSON.stringify(body),
  }, request, { headers: resHeaders });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status, headers: resHeaders });
}

export async function PUT(request: NextRequest) {
  const resHeaders = new Headers();
  const body = await request.json();

  const res = await backendFetch('/api/company/settings', {
    method: 'PUT',
    body: JSON.stringify(body),
  }, request, { headers: resHeaders });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status, headers: resHeaders });
}
