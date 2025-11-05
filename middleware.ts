import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Helper function to get the JWT secret
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

// Helper function to verify the token
async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) {
    return false;
  }
  try {
    const secret = getJwtSecret();
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    console.warn('JWT verification failed:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const isLoggedIn = await verifyToken(token);

  // If the user is on the login page
  if (pathname.startsWith('/login')) {
    // If they are already logged in, redirect them to the homepage
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Otherwise, let them see the login page
    return NextResponse.next();
  }

  // If the user is not logged in and not on the login page
  if (!isLoggedIn) {
    // Redirect them to the login page
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname); // You can use this to redirect back
    return NextResponse.redirect(loginUrl);
  }

  // If the user is logged in, let them proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};