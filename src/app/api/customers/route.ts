import { NextResponse } from 'next/server';

// Mock data for customers
let customers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', address: '123 Main St' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', address: '456 Oak Ave' }
];

export async function GET(request: Request) {
  return NextResponse.json(customers);
}

export async function POST(request: Request) {
  const newCustomer = await request.json();
  const customer = {
    id: Date.now().toString(),
    ...newCustomer
  };
  customers.push(customer);
  return NextResponse.json(customer, { status: 201 });
}