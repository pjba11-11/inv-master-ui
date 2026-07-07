import { NextResponse } from 'next/server';

// Backend exposes two separate register endpoints:
//   POST /auth/company/register  — RegisterCompanyRequest
//   POST /auth/user/register     — RegisterUserRequest
//
// This single Next.js route handles both via a `type` discriminator in the body.

let companies = [
  { id: 1, companyName: 'Default Company', gstNumber: 'GST123456789', phone: '123-456-7890', email: 'info@company.com', address: '123 Company Street', bankName: '', accountNumber: '', ifsc: '', upiId: '', logoUrl: '' },
];

let users = [
  { id: 1, companyId: 1, name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'ADMIN' },
];

// POST /api/auth/register
// body for company: { type: 'company', companyName, gstNumber, phone, email, address, bankName, accountNumber, ifsc, upiId, logoUrl }
// body for user:    { type: 'user', companyId, name, email, password, role }
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.type === 'company') {
      const { companyName, gstNumber, phone, email, address, bankName, accountNumber, ifsc, upiId, logoUrl } = body;

      if (!companyName || !email) {
        return NextResponse.json({ error: 'companyName and email are required' }, { status: 400 });
      }

      const newCompany = {
        id: Date.now(),
        companyName,
        gstNumber: gstNumber || '',
        phone: phone || '',
        email,
        address: address || '',
        bankName: bankName || '',
        accountNumber: accountNumber || '',
        ifsc: ifsc || '',
        upiId: upiId || '',
        logoUrl: logoUrl || '',
      };
      companies.push(newCompany);

      return NextResponse.json({ message: 'Company registered successfully', id: newCompany.id }, { status: 201 });
    }

    // Default: user register
    const { companyId, name, email, password, role } = body;

    if (!companyId || !name || !email || !password || !role) {
      return NextResponse.json({ error: 'companyId, name, email, password and role are required' }, { status: 400 });
    }

    if (users.some(u => u.email === email)) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const validRoles = ['ADMIN', 'MANAGER', 'SALES'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: `role must be one of: ${validRoles.join(', ')}` }, { status: 400 });
    }

    const newUser = { id: Date.now(), companyId: Number(companyId), name, email, password, role };
    users.push(newUser);

    return NextResponse.json({ message: 'User registered successfully', id: newUser.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
