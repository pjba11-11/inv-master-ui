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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const invoice = invoices.find(inv => inv.id === params.id);
  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }
  
  // In a real implementation, this endpoint would generate and return a PDF file
  // For this mock API, we return the invoice data that would be used to generate the PDF
  // along with a flag indicating this is the PDF endpoint
  
  // Set headers to indicate this is a PDF response (for real implementation)
  // const headers = new Headers();
  // headers.set('Content-Type', 'application/pdf');
  // headers.set('Content-Disposition', `attachment; filename="${invoice.number}.pdf"`);
  
  return NextResponse.json({
    message: 'PDF generation endpoint - in a real implementation, this would return a PDF file',
    invoice: invoice,
    // For actual PDF generation, you would use a library like pdfkit or jsPDF here
    // and return the binary PDF data with appropriate headers
  });
}
