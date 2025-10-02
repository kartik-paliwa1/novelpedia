import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/login', '/signup'];
const apiRoutes = ['/api'];
const publicApiRoutes = ['/api/auth', '/api/debug', '/api/cloudinary']; // Public API routes that don't require auth

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Check if this is an API route
  const isApiRoute = apiRoutes.some(route => pathname.startsWith(route));
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));
  
  // Check if route needs protection
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Get token from header or cookie
  const authHeader = req.headers.get('Authorization');
  const cookieToken = req.cookies.get('token')?.value;
  const token = authHeader?.split(' ')[1] || cookieToken;

  // Handle API routes (existing logic) - skip auth for public routes
  if (isApiRoute && !isPublicApiRoute) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Authentication failed: No token provided' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }

    // Do a lightweight expiry check without verifying signature, since
    // backend signs with its own secret (Django SimpleJWT)
    try {
      const payload = jose.decodeJwt(token);
      const exp = payload?.exp ? payload.exp * 1000 : null;
      if (exp && Date.now() < exp) {
        return NextResponse.next();
      }
    } catch {}

    return new NextResponse(
      JSON.stringify({ success: false, message: 'Authentication failed: Token expired or invalid' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }

  // Handle protected pages (dashboard routes)
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    
    // Create response to set redirect in cookie for better persistence
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set('redirectAfterLogin', pathname, {
      path: '/',
      maxAge: 60 * 10, // 10 minutes
    });
    return response;
  }

  // If accessing auth routes with valid token, redirect to dashboard
  if (isAuthRoute && token) {
    try {
      const payload = jose.decodeJwt(token);
      const exp = payload?.exp ? payload.exp * 1000 : null;
      if (!exp || Date.now() >= exp) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } catch {
      return NextResponse.next();
    }
  }

  // Verify token for protected routes
  if (isProtectedRoute && token) {
    try {
      const payload = jose.decodeJwt(token);
      const exp = payload?.exp ? payload.exp * 1000 : null;
      if (exp && Date.now() < exp) {
        return NextResponse.next();
      }
    } catch {}
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all requests except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
