import { NextResponse } from 'next/server';

// Mock data for materials (same as in route.ts)
let materials = [
  {
    id: '1',
    name: 'Steel Rod',
    description: 'Carbon steel rod, 10mm diameter, 2m length',
    unit: 'kg',
    currentPrice: 15.50,
    supplier: 'SteelWorks Inc.',
    isActive: true
  },
  {
    id: '2',
    name: 'Copper Wire',
    description: 'Insulated copper wire, 12 AWG, 100m roll',
    unit: 'm',
    currentPrice: 2.75,
    supplier: 'ElectroSupply Co.',
    isActive: true
  },
  {
    id: '3',
    name: 'Plastic Sheet',
    description: 'PVC sheet, 4x8 ft, 3mm thickness',
    unit: 'sqm',
    currentPrice: 12.00,
    supplier: 'Plastics Plus',
    isActive: false
  }
];

// Mock data for price history (same as in route.ts)
let priceHistory = [
  {
    id: '1',
    materialId: '1',
    price: 14.00,
    effectiveDate: '2024-01-01',
    recordedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
  },
  {
    id: '2',
    materialId: '1',
    price: 15.50,
    effectiveDate: '2024-02-01',
    recordedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
  },
  {
    id: '3',
    materialId: '1',
    price: 16.00,
    effectiveDate: '2024-03-01',
    recordedAt: new Date().toISOString() // today
  },
  {
    id: '4',
    materialId: '2',
    price: 2.50,
    effectiveDate: '2024-01-15',
    recordedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() // 45 days ago
  },
  {
    id: '5',
    materialId: '2',
    price: 2.75,
    effectiveDate: '2024-03-01',
    recordedAt: new Date().toISOString() // today
  }
];

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const material = materials.find(m => m.id === params.id);
  if (!material) {
    return NextResponse.json({ error: 'Material not found' }, { status: 404 });
  }
  return NextResponse.json(material);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const updatedMaterial = await request.json();
  const index = materials.findIndex(m => m.id === params.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Material not found' }, { status: 404 });
  }
  const updated = { ...materials[index], ...updatedMaterial, id: params.id };
  materials[index] = updated;
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const index = materials.findIndex(m => m.id === params.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Material not found' }, { status: 404 });
  }
  materials.splice(index, 1);
  return NextResponse.json({ message: 'Material deleted' });
}
