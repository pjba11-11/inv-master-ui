import { NextResponse } from 'next/server';

type InvoiceStatus = 'GENERATED' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED';

let invoices = [
  {
    id: 1,
    invoiceNumber: 'INV-2024-001',
    companyId: 1,
    customerId: 1,
    createdById: 1,
    invoiceDate: '2024-05-15',
    subtotal: 2475.00,
    gst: 445.50,
    discount: 247.50,
    grandTotal: 2673.00,
    status: 'GENERATED' as InvoiceStatus,
    remarks: 'Thank you for your business!',
    createdAt: '2024-05-10T10:30:00Z',
    updatedAt: '2024-05-15T14:22:00Z',
  },
  {
    id: 2,
    invoiceNumber: 'INV-2024-002',
    companyId: 1,
    customerId: 2,
    createdById: 1,
    invoiceDate: '2024-05-16',
    subtotal: 2500.00,
    gst: 450.00,
    discount: 0,
    grandTotal: 2950.00,
    status: 'PARTIALLY_PAID' as InvoiceStatus,
    remarks: '',
    createdAt: '2024-05-11T14:15:00Z',
    updatedAt: '2024-05-16T09:30:00Z',
  },
];

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = invoices.find(inv => inv.id === Number(id));
  if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  return NextResponse.json(invoice);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = invoices.findIndex(inv => inv.id === Number(id));
  if (index === -1) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  try {
    const body = await request.json();
    const subtotal: number = body.subtotal ?? invoices[index].subtotal;
    const gst: number = body.gst ?? invoices[index].gst;
    const discount: number = body.discount ?? invoices[index].discount;
    invoices[index] = {
      ...invoices[index],
      ...body,
      id: Number(id),
      subtotal,
      gst,
      discount,
      grandTotal: parseFloat((subtotal + gst - discount).toFixed(2)),
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json(invoices[index]);
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = invoices.findIndex(inv => inv.id === Number(id));
  if (index === -1) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  invoices.splice(index, 1);
  return NextResponse.json({ message: 'Invoice deleted' });
}
