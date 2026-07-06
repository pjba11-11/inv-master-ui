import { NextResponse } from 'next/server';

// Mock products data
let products = [
  { id: '1', name: 'Product A', description: 'Description A', price: 29.99, category: 'Electronics' },
  { id: '2', name: 'Product B', description: 'Description B', price: 49.99, category: 'Home & Garden' },
  { id: '3', name: 'Product C', description: 'Description C', price: 99.99, category: 'Tools' }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const filtered = category ? products.filter(p => p.category === category) : products;
  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const newProduct = await request.json();
  const product = {
    id: Date.now().toString(),
    ...newProduct
  };
  products.push(product);
  return NextResponse.json(product, { status: 201 });
}