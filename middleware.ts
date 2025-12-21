
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, decrypt } from './lib/auth';

const PROTECTED_ROUTES = ['/dashboard', '/api/portfolio'];
const PUBLIC_ROUTES = ['/login', '/api/auth/login'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => path.startsWith(route));
  const isPublicRoute = PUBLIC_ROUTES.some((route) => path.startsWith(route));
  
  if (path.startsWith('/api/auth/login')) {
      return NextResponse.next();
  }

  // Check if it's a protected route (Dashboard or API)
  if (isProtectedRoute) {
    const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = cookie ? await decrypt(cookie) : null;

    if (!session?.user) {
      if (path.startsWith('/api')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      } else {
        return NextResponse.redirect(new URL('/', req.nextUrl));
      }
    }
  }

  // Redirect to dashboard if logged in and trying to access login
  if (path === '/login') {
    const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = cookie ? await decrypt(cookie) : null;
    if (session?.user) {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
