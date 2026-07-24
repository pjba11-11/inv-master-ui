import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password'];

// Edge-safe check of the JWT `exp` claim. Does NOT verify the signature
// (the secret lives only on the backend) — the backend remains the source of
// truth. This just avoids treating a structurally-invalid or expired token as
// a valid session at the routing layer.
function hasValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const segment = token.split('.')[1];
  if (!segment) return false;
  try {
    const json = atob(segment.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(json) as { exp?: number };
    if (typeof payload.exp !== 'number') return false;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const refresh = request.cookies.get('refresh_token')?.value;

  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p));
  // Valid session = live access token, OR an expired access token backed by a
  // still-valid refresh token (the API layer silently rotates it on next call).
  const authed = hasValidToken(token) || hasValidToken(refresh);

  if (!authed && !isPublic) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (authed && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
