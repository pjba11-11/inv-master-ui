import { NextResponse } from 'next/server';

// Shape matches CompanyDTO / RegisterCompanyRequest from the backend.
let company = {
  id: 1,
  companyName: 'Acme Corporation',
  gstNumber: 'GST123456789',
  phone: '+91 98765 43210',
  email: 'info@acme.com',
  address: '123 Business Avenue, Suite 100, Mumbai, Maharashtra 400001',
  bankName: 'State Bank of India',
  accountNumber: '1234567890',
  ifsc: 'SBIN0000123',
  upiId: 'acme@sbi',
  logoUrl: '',
  createdAt: '2023-01-15T08:00:00Z',
  updatedAt: '2023-05-20T14:30:00Z',
};

export async function GET() {
  return NextResponse.json(company);
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json();
    company = { ...company, ...updates, updatedAt: new Date().toISOString() };
    return NextResponse.json(company);
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
