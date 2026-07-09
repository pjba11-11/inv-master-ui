import { NextResponse } from 'next/server';

// Status matches backend InvoiceStatus enum: GENERATED | PARTIALLY_PAID | PAID | CANCELLED
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
    cgst: 222.75,
    sgst: 222.75,
    discount: 247.50,
    grandTotal: 2673.00,
    poNumber: '',
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
    cgst: 225.00,
    sgst: 225.00,
    discount: 0,
    grandTotal: 2950.00,
    poNumber: 'PO-2024-002',
    status: 'PARTIALLY_PAID' as InvoiceStatus,
    remarks: '',
    createdAt: '2024-05-11T14:15:00Z',
    updatedAt: '2024-05-16T09:30:00Z',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const customerId = searchParams.get('customerId');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  let result = [...invoices];

  if (status) result = result.filter(inv => inv.status === status);
  if (customerId) result = result.filter(inv => inv.customerId === Number(customerId));

  result.sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime());

  const total = result.length;
  const paginatedInvoices = result.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    invoices: paginatedInvoices,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.invoiceDate) {
      return NextResponse.json({ error: 'invoiceDate is required' }, { status: 400 });
    }

    const subtotal: number = body.subtotal ?? 0;
    const cgst: number = body.cgst ?? 0;
    const sgst: number = body.sgst ?? 0;
    const discount: number = body.discount ?? 0;
    const grandTotal = subtotal + cgst + sgst - discount;

    const newInvoice = {
      id: Date.now(),
      invoiceNumber: body.invoiceNumber || `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      companyId: body.companyId || 1,
      customerId: body.customerId ? Number(body.customerId) : null,
      createdById: body.createdById || 1,
      invoiceDate: body.invoiceDate,
      subtotal,
      cgst,
      sgst,
      discount,
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      poNumber: body.poNumber || '',
      status: (body.status as InvoiceStatus) || 'GENERATED',
      remarks: body.remarks || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    invoices.push(newInvoice);
    return NextResponse.json(newInvoice, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
