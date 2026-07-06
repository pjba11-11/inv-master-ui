import { NextResponse } from 'next/server';

// Invoice status types
type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue';

// Mock data for invoices (same as in route.ts)
let invoices = [
  {
    id: '1',
    number: 'INV-001',
    date: '2023-05-15',
    customerName: 'Acme Corp',
    customerEmail: 'info@acme.com',
    customerAddress: '123 Business Ave, Suite 100\nNew York, NY 10001\nUSA',
    items: [
      { id: '1', description: 'Web Development Services', quantity: 10, rate: 100, tax: 15 },
      { id: '2', description: 'UI/UX Design', quantity: 5, rate: 150, tax: 15 },
      { id: '3', description: 'Project Management', quantity: 8, rate: 75, tax: 15 }
    ],
    discount: 10,
    taxRate: 15,
    subtotal: 2475,
    taxAmount: 371.25,
    total: 2558.25,
    status: 'sent' as InvoiceStatus,
    notes: 'Thank you for your business!',
    terms: 'Payment due within 30 days. Late payments subject to 1.5% monthly fee.',
    createdAt: '2023-05-10T10:30:00Z',
    updatedAt: '2023-05-15T14:22:00Z',
    payments: [
      { id: 'pay1', amount: 500, date: '2023-05-20', method: 'Bank Transfer', reference: 'TXN123456' }
    ]
  },
  {
    id: '2',
    number: 'INV-002',
    date: '2023-05-16',
    customerName: 'Widget Inc',
    customerEmail: 'sales@widgetinc.com',
    customerAddress: '456 Industrial Blvd\nChicago, IL 60601\nUSA',
    items: [
      { id: '4', description: 'Software Licenses', quantity: 5, rate: 200, tax: 8 },
      { id: '5', description: 'Implementation Services', quantity: 20, rate: 75, tax: 8 }
    ],
    discount: 5,
    taxRate: 8,
    subtotal: 2500,
    taxAmount: 200,
    total: 2375,
    status: 'pending' as InvoiceStatus,
    notes: 'Please contact us for any questions.',
    terms: 'Net 30 days.',
    createdAt: '2023-05-11T14:15:00Z',
    updatedAt: '2023-05-16T09:30:00Z',
    payments: []
  }
];

// Helper function to calculate invoice totals
const calculateInvoiceTotals = (items: any[], discount: number, taxRate: number) => {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + taxAmount - discountAmount;
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
};

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const invoice = invoices.find(inv => inv.id === params.id);
  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }
  return NextResponse.json(invoice.payments);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const invoiceIndex = invoices.findIndex(inv => inv.id === params.id);
    if (invoiceIndex === -1) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    
    const invoice = invoices[invoiceIndex];
    const paymentData = await request.json();
    
    // Validate required fields
    if (!paymentData.amount || !paymentData.date || !paymentData.method) {
      return NextResponse.json(
        { error: 'Amount, date, and method are required' },
        { status: 400 }
      );
    }
    
    // Validate amount
    const amount = parseFloat(paymentData.amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }
    
    // Calculate current total paid
    const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
    const balanceDue = invoice.total - totalPaid;
    
    if (amount > balanceDue) {
      return NextResponse.json(
        { error: `Payment amount cannot exceed balance due of $${balanceDue.toFixed(2)}` },
        { status: 400 }
      );
    }
    
    // Add the new payment
    const newPayment = {
      id: `pay${Date.now()}`,
      amount,
      date: paymentData.date,
      method: paymentData.method,
      reference: paymentData.reference || '',
      remarks: paymentData.remarks || ''
    };
    
    invoice.payments.push(newPayment);
    
    // Update invoice status if fully paid
    const newTotalPaid = totalPaid + amount;
    if (newTotalPaid >= invoice.total) {
      invoice.status = 'paid' as InvoiceStatus;
    } else if (newTotalPaid > 0) {
      // Partially paid - could set to a custom status if needed, but keeping existing status
      // In a real system, you might have a 'partially paid' status
    }
    
    invoice.updatedAt = new Date().toISOString();
    
    // Update the invoice in the array
    invoices[invoiceIndex] = invoice;
    
    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}
