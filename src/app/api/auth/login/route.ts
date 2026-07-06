import { NextResponse } from 'next/server';

// Mock user data
let users = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123', // In a real app, this would be hashed
    name: 'Admin User',
    role: 'ADMIN',
    companyId: '1'
  },
  {
    id: '2',
    email: 'manager@example.com',
    password: 'manager123',
    name: 'Manager User',
    role: 'MANAGER',
    companyId: '1'
  },
  {
    id: '3',
    email: 'sales@example.com',
    password: 'sales123',
    name: 'Sales User',
    role: 'SALES',
    companyId: '1'
  }
];

// Mock company data (same as in companies route)
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
  taxRate: 15,
  logoUrl: '',
  createdAt: '2023-01-15T08:00:00Z',
  updatedAt: '2023-05-20T14:30:00Z'
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Remove password from user object before sending response
    const { password: _, ...userWithoutPassword } = user;
    
    // In a real app, we would generate a JWT token here
    // For this mock, we'll return user and company data
    
    return NextResponse.json({
      user: userWithoutPassword,
      company
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}
