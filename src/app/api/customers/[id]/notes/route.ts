import { NextResponse } from 'next/server';

// Mock data for customer notes (in a real app, this would be in a database)
let customerNotes: Record<string, Array<{ id: string; customerId: string; note: string; createdAt: string }>> = {
  '1': [
    { id: '1', customerId: '1', note: 'Initial customer setup', createdAt: new Date().toISOString() },
    { id: '2', customerId: '1', note: 'Follow-up call scheduled', createdAt: new Date().toISOString() }
  ],
  '2': [
    { id: '3', customerId: '2', note: 'New customer added', createdAt: new Date().toISOString() }
  ]
};

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notes = customerNotes[id] || [];
  return NextResponse.json(notes);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const newNote = await request.json();
  const note = {
    id: Date.now().toString(),
    customerId: id,
    ...newNote,
    createdAt: new Date().toISOString()
  };
  if (!customerNotes[id]) {
    customerNotes[id] = [];
  }
  customerNotes[id].push(note);
  return NextResponse.json(note, { status: 201 });
}