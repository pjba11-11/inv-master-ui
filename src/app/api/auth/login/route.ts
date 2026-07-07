import { NextResponse } from 'next/server';

// Mock users — role matches backend enum: ADMIN | MANAGER | SALES
let users = [
  { id: 1, companyId: 1, name: 'Admin User',   email: 'admin@example.com',   password: 'admin123',   role: 'ADMIN' },
  { id: 2, companyId: 1, name: 'Manager User', email: 'manager@example.com', password: 'manager123', role: 'MANAGER' },
  { id: 3, companyId: 1, name: 'Sales User',   email: 'sales@example.com',   password: 'sales123',   role: 'SALES' },
];

// POST /auth/login — body: { email, password }
// Returns: { accessToken, refreshToken }  (mirrors backend LoginResponse)
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Dummy JWT-shaped tokens (base64 placeholder — not real JWTs)
    const accessToken  = `mock-access-token.${btoa(JSON.stringify({ sub: user.email, role: user.role, companyId: user.companyId }))}.sig`;
    const refreshToken = `mock-refresh-token.${btoa(JSON.stringify({ sub: user.email }))}.sig`;

    return NextResponse.json({ accessToken, refreshToken });
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
