import { NextResponse } from 'next/server';

// Mock data for customers (same as in route.ts)
let customers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', address: '123 Main St' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', address: '456 Oak Ave' }
];

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = customers.find(c => c.id === id);
  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }
  return NextResponse.json(customer);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updatedCustomer = await request.json();
  const index = customers.findIndex(c => c.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }
  const updated = { ...customers[index], ...updatedCustomer, id: id };
  customers[index] = updated;
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = customers.findIndex(c => c.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }
  customers.splice(index, 1);
  return NextResponse.json({ message: 'Customer deleted' });
}