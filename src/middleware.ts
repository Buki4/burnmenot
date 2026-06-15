import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthPath = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/api/auth');
  const hasCookie = request.cookies.has('burnmenot_auth');

  // If trying to access protected route without cookie
  if (!isAuthPath && !hasCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access login page while already authenticated
  if (isAuthPath && request.nextUrl.pathname === '/login' && hasCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/cron (cron jobs are protected by CRON_SECRET separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/cron).*)',
  ],
};
