import { NextResponse } from 'next/server';

let products = [
  {
    productId: 1, companyId: 1, productName: 'Steel Frame', description: 'Welded steel frame for industrial use',
    active: true, manufacturingCost: 1200.00, sellingPrice: 1800.00, profitMargin: 50.00,
    materials: [{ id: 1, materialName: 'Steel Rod', unit: 'kg', currentPrice: 15.50 }],
    createdAt: '2024-01-10T08:00:00Z', updatedAt: '2024-01-10T08:00:00Z', deletedAt: null as string | null,
  },
  {
    productId: 2, companyId: 1, productName: 'Copper Cable Assembly', description: 'Pre-wired copper cable assembly',
    active: true, manufacturingCost: 500.00, sellingPrice: 750.00, profitMargin: 50.00,
    materials: [{ id: 2, materialName: 'Copper Wire', unit: 'm', currentPrice: 2.75 }],
    createdAt: '2024-02-01T09:00:00Z', updatedAt: '2024-02-01T09:00:00Z', deletedAt: null as string | null,
  },
];

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find(p => p.productId === Number(id) && !p.deletedAt);
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = products.findIndex(p => p.productId === Number(id) && !p.deletedAt);
  if (index === -1) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  try {
    const body = await request.json();
    const manufacturingCost: number = body.manufacturingCost ?? products[index].manufacturingCost;
    const sellingPrice: number = body.sellingPrice ?? products[index].sellingPrice;
    const profitMargin = manufacturingCost > 0
      ? parseFloat((((sellingPrice - manufacturingCost) / manufacturingCost) * 100).toFixed(2))
      : 0;
    products[index] = { ...products[index], ...body, productId: Number(id), manufacturingCost, sellingPrice, profitMargin, updatedAt: new Date().toISOString() };
    return NextResponse.json(products[index]);
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}

// Soft delete
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = products.findIndex(p => p.productId === Number(id) && !p.deletedAt);
  if (index === -1) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  products[index].deletedAt = new Date().toISOString();
  return NextResponse.json({ message: 'Product deleted' });
}
