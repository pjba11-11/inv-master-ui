import { NextResponse } from 'next/server';

// Shape matches the customers table: customerName, billingAddress, shippingAddress (single TEXT fields).
// soft-delete via deletedAt — no hard deletes.
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  let result = customers.filter(c => !c.deletedAt);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(c =>
      c.customerName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  }
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.customerName) {
      return NextResponse.json({ error: 'customerName is required' }, { status: 400 });
    }
    const newCustomer = {
      id: Date.now(),
      companyId: body.companyId || 1,
      customerName: body.customerName,
      phone: body.phone || '',
      email: body.email || '',
      gstNumber: body.gstNumber || '',
      billingAddress: body.billingAddress || '',
      shippingAddress: body.shippingAddress || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null as string | null,
    };
    customers.push(newCustomer);
    return NextResponse.json(newCustomer, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
