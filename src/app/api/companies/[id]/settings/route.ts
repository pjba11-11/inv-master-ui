import { NextResponse } from 'next/server';

// Shape matches SettingsDTO / CreateSettingsRequest from the backend.
let settings = {
  id: 1,
  companyId: 1,
  gstPercentage: 18.00,
  cgstPercentage: 9.00,
  sgstPercentage: 9.00,
  vehicleNumbers: [] as string[],
  defaultProfitMargin: 20.00,
  currency: 'INR',
  invoicePrefix: 'INV',
  financialYear: '2024-25',
  createdAt: '2023-01-15T08:00:00Z',
  updatedAt: '2023-05-20T14:30:00Z',
};

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (Number(id) !== settings.companyId) {
    return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
  }
  return NextResponse.json(settings);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (Number(id) !== settings.companyId) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }
    const updates = await request.json();
    settings = { ...settings, ...updates, updatedAt: new Date().toISOString() };
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    settings = { ...settings, ...body, companyId: Number(id), updatedAt: new Date().toISOString() };
    return NextResponse.json(settings, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
