import { NextResponse } from 'next/server';

let materials = [
  { id: 1, companyId: 1, materialName: 'Steel Rod',     unit: 'kg',  currentPrice: 15.50, active: true,  createdAt: '2024-01-01T08:00:00Z', updatedAt: '2024-01-01T08:00:00Z', deletedAt: null as string | null },
  { id: 2, companyId: 1, materialName: 'Copper Wire',   unit: 'm',   currentPrice: 2.75,  active: true,  createdAt: '2024-01-15T09:00:00Z', updatedAt: '2024-01-15T09:00:00Z', deletedAt: null as string | null },
  { id: 3, companyId: 1, materialName: 'Plastic Sheet', unit: 'sqm', currentPrice: 12.00, active: false, createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T10:00:00Z', deletedAt: null as string | null },
];

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const material = materials.find(m => m.id === Number(id) && !m.deletedAt);
  if (!material) return NextResponse.json({ error: 'Material not found' }, { status: 404 });
  return NextResponse.json(material);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = materials.findIndex(m => m.id === Number(id) && !m.deletedAt);
  if (index === -1) return NextResponse.json({ error: 'Material not found' }, { status: 404 });
  try {
    const body = await request.json();
    materials[index] = { ...materials[index], ...body, id: Number(id), updatedAt: new Date().toISOString() };
    return NextResponse.json(materials[index]);
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}

// Soft delete
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = materials.findIndex(m => m.id === Number(id) && !m.deletedAt);
  if (index === -1) return NextResponse.json({ error: 'Material not found' }, { status: 404 });
  materials[index].deletedAt = new Date().toISOString();
  return NextResponse.json({ message: 'Material deleted' });
}
