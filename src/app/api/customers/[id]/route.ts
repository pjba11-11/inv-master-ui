import { NextResponse } from 'next/server';

let customers = [
  {
    id: 1,
    companyId: 1,
    customerName: 'John Doe',
    phone: '9876543210',
    email: 'john@example.com',
    gstNumber: 'GST111111111',
    billingAddress: '123 Main St, Mumbai, Maharashtra 400001',
    shippingAddress: '123 Main St, Mumbai, Maharashtra 400001',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
    deletedAt: null as string | null,
  },
  {
    id: 2,
    companyId: 1,
    customerName: 'Jane Smith',
    phone: '9123456780',
    email: 'jane@example.com',
    gstNumber: '',
    billingAddress: '456 Oak Ave, Delhi 110001',
    shippingAddress: '',
    createdAt: '2024-02-05T11:30:00Z',
    updatedAt: '2024-02-05T11:30:00Z',
    deletedAt: null as string | null,
  },
];

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = customers.find(c => c.id === Number(id) && !c.deletedAt);
  if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  return NextResponse.json(customer);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = customers.findIndex(c => c.id === Number(id) && !c.deletedAt);
  if (index === -1) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  try {
    const body = await request.json();
    customers[index] = { ...customers[index], ...body, id: Number(id), updatedAt: new Date().toISOString() };
    return NextResponse.json(customers[index]);
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}

// Soft delete
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = customers.findIndex(c => c.id === Number(id) && !c.deletedAt);
  if (index === -1) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  customers[index].deletedAt = new Date().toISOString();
  return NextResponse.json({ message: 'Customer deleted' });
}
