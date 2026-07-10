import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

// Backend has no GET /products/{id}, so fetch all and filter by productId
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resHeaders = new Headers();

  const res = await backendFetch('/products', {}, request, { headers: resHeaders });
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch product' }, { status: res.status, headers: resHeaders });

  const products: any[] = await res.json();
  const product = products.find((p: any) => String(p.productId) === id);

  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json(product, { headers: resHeaders });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resHeaders = new Headers();
  const body = await request.json();

  const res = await backendFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  }, request, { headers: resHeaders });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status, headers: resHeaders });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resHeaders = new Headers();

  const res = await backendFetch(`/products/${id}`, {
    method: 'DELETE',
  }, request, { headers: resHeaders });

  if (res.status === 204) return NextResponse.json({ message: 'Product deleted' }, { headers: resHeaders });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status, headers: resHeaders });
}
