import { NextResponse } from 'next/server';

// Mock user data (same as in login route)
let users = [
  {
    id: '1',
    email: 'admin@company.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'ADMIN',
    companyId: '1'
  },
  {
    id: '2',
    email: 'manager@company.com',
    password: 'manager123',
    name: 'Manager User',
    role: 'MANAGER',
    companyId: '1'
  },
  {
    id: '3',
    email: 'sales@company.com',
    password: 'sales123',
    name: 'Sales User',
    role: 'SALES',
    companyId: '1'
  }
];

// Mock company data
let companies = [
  {
    id: '1',
    name: 'Default Company',
    email: 'info@company.com',
    phone: '123-456-7890',
    address: '123 Company Street\nCity, State 12345\nUSA',
    gst: 'GST123456789',
    createdAt: '2023-01-15T09:30:00Z'
  }
];

export async function POST(request: Request) {
  try {
    const { 
      email, 
      password, 
      name,
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      companyGst
    } = await request.json();
    
    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Create new company if provided
    let companyId = '1'; // Default to existing company
    if (companyName) {
      const newCompany = {
        id: Date.now().toString(),
        name: companyName,
        email: companyEmail || '',
        phone: companyPhone || '',
        address: companyAddress || '',
        gst: companyGst || '',
        createdAt: new Date().toISOString()
      };
      companies.push(newCompany);
      companyId = newCompany.id;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In real app, this would be hashed
      name,
      role: 'ADMIN', // First user of a company is admin
      companyId
    };
    
    users.push(newUser);
    
    // In a real app, we would create a JWT token or session
    // For this mock, we'll set a simple cookie
    // Note: In a real registration flow, we might not log in automatically
    
    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      message: 'Registration successful',
      user: userWithoutPassword
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}
