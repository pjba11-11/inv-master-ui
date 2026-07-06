import { NextResponse } from 'next/server';

// Mock data for company (single company for now - in multi-tenant app, this would be per user/tenant)
let company = {
  id: '1',
  name: 'Acme Corporation',
  gstNumber: 'GST123456789',
  email: 'info@acme.com',
  phone: '+1 (555) 123-4567',
  address: '123 Business Avenue\nSuite 100\nNew York, NY 10001\nUSA',
  bankDetails: {
    bankName: 'First National Bank',
    accountNumber: '1234567890',
    routingNumber: '021000021',
    swiftCode: 'FNBAUS33'
  },
  invoicePrefix: 'INV',
  financialYearStart: '2024-04-01',
  currency: 'USD',
  taxRate: 15, // Default GST/VAT rate
  logoUrl: '', // Would be a URL to uploaded logo
  createdAt: '2023-01-15T08:00:00Z',
  updatedAt: '2023-05-20T14:30:00Z'
};

export async function GET(request: Request) {
  return NextResponse.json(company);
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json();
    
    // Update company data
    company = {
      ...company,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(company);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}
