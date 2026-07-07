import { NextResponse } from 'next/server';

// Shape matches InvoiceLineItemDTO: productId, productName, quantity, unitPrice, total.
// (no free-text description — items reference a product FK)
let lineItems = [
  { id: 1, invoiceId: 1, productId: 1, productName: 'Steel Frame',          quantity: 10, unitPrice: 180.00, total: 1800.00 },
  { id: 2, invoiceId: 1, productId: 2, productName: 'Copper Cable Assembly', quantity:  5, unitPrice: 135.00, total:  675.00 },
  { id: 3, invoiceId: 2, productId: 1, productName: 'Steel Frame',           quantity:  8, unitPrice: 180.00, total: 1440.00 },
  { id: 4, invoiceId: 2, productId: 2, productName: 'Copper Cable Assembly', quantity:  8, unitPrice: 132.50, total: 1060.00 },
];

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = lineItems.filter(li => li.invoiceId === Number(id));
  return NextResponse.json(items);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.productId || !body.quantity || !body.unitPrice) {
      return NextResponse.json({ error: 'productId, quantity, and unitPrice are required' }, { status: 400 });
    }

    const newItem = {
      id: Date.now(),
      invoiceId: Number(id),
      productId: Number(body.productId),
      productName: body.productName || '',
      quantity: Number(body.quantity),
      unitPrice: Number(body.unitPrice),
      total: parseFloat((Number(body.quantity) * Number(body.unitPrice)).toFixed(2)),
    };

    lineItems.push(newItem);
    return NextResponse.json(newItem, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
