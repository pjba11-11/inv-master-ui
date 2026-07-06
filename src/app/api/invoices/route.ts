import { NextResponse } from 'next/server';

// Invoice status types
type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue';

// Mock data for invoices
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const customerName = searchParams.get('customerName');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  
  let filteredInvoices = [...invoices];
  
  // Filter by status
  if (status) {
    filteredInvoices = filteredInvoices.filter(invoice => invoice.status === status);
  }
  
  // Filter by customer name (partial match)
  if (customerName) {
    const searchLower = customerName.toLowerCase();
    filteredInvoices = filteredInvoices.filter(invoice => 
      invoice.customerName.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort by date descending (newest first)
  filteredInvoices.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Paginate
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);
  
  // Return simplified invoice objects for list view
  const invoiceList = paginatedInvoices.map(invoice => ({
    id: invoice.id,
    number: invoice.number,
    date: invoice.date,
    customerName: invoice.customerName,
    amount: invoice.total,
    status: invoice.status
  }));
  
  return NextResponse.json({
    invoices: invoiceList,
    pagination: {
      page,
      limit,
      total: filteredInvoices.length,
      totalPages: Math.ceil(filteredInvoices.length / limit)
    }
  });
}

export async function POST(request: Request) {
  try {
    const invoiceData = await request.json();
    
    // Validate required fields
    if (!invoiceData.customerName || !invoiceData.customerEmail) {
      return NextResponse.json(
        { error: 'Customer name and email are required' },
        { status: 400 }
      );
    }
    
    // Calculate totals
    const { subtotal, taxAmount, discountAmount, total } = calculateInvoiceTotals(
      invoiceData.items || [],
      invoiceData.discount || 0,
      invoiceData.taxRate || 0
    );
    
    const newInvoice = {
      id: Date.now().toString(),
      number: `INV-${Date.now().toString().slice(-6)}`, // Simple invoice number generation
      date: invoiceData.date || new Date().toISOString().split('T')[0],
      customerName: invoiceData.customerName,
      customerEmail: invoiceData.customerEmail,
      customerAddress: invoiceData.customerAddress || '',
      items: invoiceData.items || [],
      discount: invoiceData.discount || 0,
      taxRate: invoiceData.taxRate || 0,
      subtotal,
      taxAmount,
      discountAmount,
      total,
      status: (invoiceData.status as InvoiceStatus) || 'draft',
      notes: invoiceData.notes || '',
      terms: invoiceData.terms || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      payments: invoiceData.payments || []
    };
    
    invoices.push(newInvoice);
    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}
