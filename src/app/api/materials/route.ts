import { NextResponse } from 'next/server';

// Shape matches MaterialDTO — no description or supplier columns in the backend schema.
let materials = [
  {
    id: 1,
    companyId: 1,
    materialName: 'Steel Rod',
    unit: 'kg',
    currentPrice: 15.50,
    active: true,
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
    deletedAt: null as string | null,
  },
  {
    id: 2,
    companyId: 1,
    materialName: 'Copper Wire',
    unit: 'm',
    currentPrice: 2.75,
    active: true,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    deletedAt: null as string | null,
  },
  {
    id: 3,
    companyId: 1,
    materialName: 'Plastic Sheet',
    unit: 'sqm',
    currentPrice: 12.00,
    active: false,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
    deletedAt: null as string | null,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const active = searchParams.get('active');

  let result = materials.filter(m => !m.deletedAt);

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(m => m.materialName.toLowerCase().includes(q) || m.unit.toLowerCase().includes(q));
  }

  if (active !== null) {
    result = result.filter(m => m.active === (active === 'true'));
  }

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.materialName || !body.unit) {
      return NextResponse.json({ error: 'materialName and unit are required' }, { status: 400 });
    }
    const newMaterial = {
      id: Date.now(),
      companyId: body.companyId || 1,
      materialName: body.materialName,
      unit: body.unit,
      currentPrice: body.currentPrice ?? 0,
      active: body.active !== undefined ? body.active : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null as string | null,
    };
    materials.push(newMaterial);
    return NextResponse.json(newMaterial, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
