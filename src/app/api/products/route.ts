import { NextResponse } from 'next/server';

// Shape matches ProductFullResponse from the backend:
//   productId, productName, description, active,
//   manufacturingCost, sellingPrice, profitMargin,
//   materials: [{ id, materialName, unit, currentPrice }]
let products = [
  {
    productId: 1,
    companyId: 1,
    productName: 'Steel Frame',
    description: 'Welded steel frame for industrial use',
    active: true,
    manufacturingCost: 1200.00,
    sellingPrice: 1800.00,
    profitMargin: 50.00,
    materials: [
      { id: 1, materialName: 'Steel Rod', unit: 'kg', currentPrice: 15.50 },
    ],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z',
    deletedAt: null as string | null,
  },
  {
    productId: 2,
    companyId: 1,
    productName: 'Copper Cable Assembly',
    description: 'Pre-wired copper cable assembly',
    active: true,
    manufacturingCost: 500.00,
    sellingPrice: 750.00,
    profitMargin: 50.00,
    materials: [
      { id: 2, materialName: 'Copper Wire', unit: 'm', currentPrice: 2.75 },
    ],
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z',
    deletedAt: null as string | null,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const active = searchParams.get('active');

  let result = products.filter(p => !p.deletedAt);

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p => p.productName.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
  }

  if (active !== null) {
    result = result.filter(p => p.active === (active === 'true'));
  }

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.productName) {
      return NextResponse.json({ error: 'productName is required' }, { status: 400 });
    }
    if (!body.materials || body.materials.length === 0) {
      return NextResponse.json({ error: 'At least one material is required' }, { status: 400 });
    }

    const manufacturingCost: number = body.manufacturingCost ?? 0;
    const sellingPrice: number = body.sellingPrice ?? 0;
    const profitMargin = manufacturingCost > 0
      ? parseFloat((((sellingPrice - manufacturingCost) / manufacturingCost) * 100).toFixed(2))
      : 0;

    const newProduct = {
      productId: Date.now(),
      companyId: body.companyId || 1,
      productName: body.productName,
      description: body.description || '',
      active: body.active !== undefined ? body.active : true,
      manufacturingCost,
      sellingPrice,
      profitMargin,
      materials: body.materials,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null as string | null,
    };
    products.push(newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
