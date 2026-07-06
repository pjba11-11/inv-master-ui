import { NextResponse } from 'next/server';

// Mock data for company settings
let companySettings = {
  id: '1',
  companyId: '1',
  taxSettings: {
    defaultTaxRate: 15,
    taxCalculationMethod: 'exclusive', // or 'inclusive'
    taxDisplayFormat: 'percentage' // or 'amount'
  },
  invoiceSettings: {
    prefix: 'INV',
    startingNumber: 1000,
    dateFormat: 'MM/DD/YYYY',
    dueDaysDefault: 30,
    showPurchaseOrder: true,
    showTermsConditions: true
  },
  paymentSettings: {
    acceptedMethods: ['bank_transfer', 'credit_card', 'paypal', 'check'],
    lateFeeEnabled: true,
    lateFeePercentage: 1.5, // Monthly
    gracePeriodDays: 5
  },
  emailSettings: {
    template: 'professional',
    senderName: 'Accounts Department',
    senderEmail: 'accounts@company.com',
    ccEmail: '',
    bccEmail: ''
  },
  currencySettings: {
    baseCurrency: 'USD',
    symbolPosition: 'before', // or 'after'
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.'
  },
  updatedAt: '2023-05-20T14:30:00Z'
};

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id !== '1') {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }
  return NextResponse.json(companySettings);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (id !== '1') {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const updates = await request.json();

    // Update company settings
    companySettings = {
      ...companySettings,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(companySettings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}
