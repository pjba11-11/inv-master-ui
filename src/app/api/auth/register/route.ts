import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8080';

// POST /api/auth/register
// body: { type: 'company', companyName, gstNumber?, phone, email, address?, bankName?, accountNumber?, ifsc?, upiId?, logo? }
// body: { type: 'user', companyId, name, email, password, role }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, ...rest } = body;

    if (type === 'company') {
      const res = await fetch(`${BACKEND}/auth/company/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest),
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    if (type === 'user') {
      const res = await fetch(`${BACKEND}/auth/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest),
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ error: 'type must be "company" or "user"' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Registration request failed' }, { status: 500 });
  }
}
