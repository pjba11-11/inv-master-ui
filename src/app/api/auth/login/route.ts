import { NextResponse } from 'next/server';
import { backendUrl, decodeJwtPayload } from '@/lib/backend';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const backendRes = await fetch(backendUrl('/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: body.email, password: body.password }),
    });

    if (!backendRes.ok) {
      const status = backendRes.status === 403 ? 401 : backendRes.status;
      return NextResponse.json({ error: 'Invalid email or password' }, { status });
    }

    const { accessToken, refreshToken } = await backendRes.json();

    const payload = decodeJwtPayload(accessToken);
    const email = payload.sub as string;
    const role = (payload.role as string ?? '').replace('ROLE_', '');
    const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const res = NextResponse.json({
      accessToken,
      refreshToken,
      user: { name, email, role },
    });

    const secure = process.env.NODE_ENV === 'production';

    res.cookies.set('auth_token', accessToken, {
      httpOnly: true,
      secure,
      path: '/',
      maxAge: 60 * 60 * 8,
      sameSite: 'lax',
    });

    res.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    return res;
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
