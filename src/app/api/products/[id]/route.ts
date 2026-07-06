import { NextResponse } from 'next/server';

let products = [
  { id: '1', name: 'Product A', description: 'Description A', price: 29.99, category: 'Electronics' },
  { id: '2', name: 'Product B', description: 'Description B', price: 49.99, category: 'Home & Garden' },
  { id: '3', name: 'Product C', description: 'Description C', price: 99.99, category: 'Tools' }
];

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const product = products.find(p => p.id === params.id);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const updatedProduct = await request.json();
  const index = products.findIndex(p => p.id === params.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  const updated = { ...products[index], ...updatedProduct, id: params.id };
  products[index] = updated;
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const index = products.findIndex(p => p.id === params.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  products.splice(index, 1);
  return NextResponse.json({ message: 'Product deleted' });
}