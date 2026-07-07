import { NextResponse } from 'next/server';

// Shape matches PaymentDTO: paymentDate, amount, paymentMethod, transactionReference, remarks.
let payments = [
  {
    id: 1,
    invoiceId: 1,
    paymentDate: '2024-05-20',
    amount: 500.00,
    paymentMethod: 'BANK_TRANSFER',
    transactionReference: 'TXN123456',
    remarks: '',
    createdAt: '2024-05-20T10:00:00Z',
  },
  {
    id: 2,
    invoiceId: 2,
    paymentDate: '2024-05-22',
    amount: 1000.00,
    paymentMethod: 'UPI',
    transactionReference: 'UPI789012',
    remarks: 'Partial payment',
    createdAt: '2024-05-22T11:00:00Z',
  },
];

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json(payments.filter(p => p.invoiceId === Number(id)));
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.amount || !body.paymentDate || !body.paymentMethod) {
      return NextResponse.json({ error: 'amount, paymentDate, and paymentMethod are required' }, { status: 400 });
    }

    const amount = parseFloat(body.amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'amount must be a positive number' }, { status: 400 });
    }

    const newPayment = {
      id: Date.now(),
      invoiceId: Number(id),
      paymentDate: body.paymentDate,
      amount,
      paymentMethod: body.paymentMethod,
      transactionReference: body.transactionReference || '',
      remarks: body.remarks || '',
      createdAt: new Date().toISOString(),
    };

    payments.push(newPayment);
    return NextResponse.json(newPayment, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
