import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decodeToken, getCookie, removeCookie } from '@/app/lib/auth';

// 1. Specify protected and public routes
const protectedRoutes = ['/user', '/police'];
const publicRoutes = ['/login', '/signup', '/'];

export default function middleware(req: NextRequest) {
    //Check if the current route is protected or public
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

    console.log(`Current path: ${path}`);

    const sessionCookie = cookies().get('session');
    const roles = cookies().get('roles');

    console.log("Session Cookie:", sessionCookie);
    console.log("Role exists", roles);
    let role = null;
    // Check if cookie exists and decode token
    if (sessionCookie) {
        console.log("sessionCookie exists:", sessionCookie);
        try {
            

        } catch (error) {
        console.error("Failed to decode token:", error);
        // Redirect to login if token decoding fails
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
        }
    }else{
        role = null;
    }

      // Role-based access control for specific routes
    if (isProtectedRoute) {
        if (path.startsWith('/user') && role !== 'User') {
        // Redirect unauthorized "user" role access
        return NextResponse.redirect(new URL('/login', req.url));
        }
        if (path.startsWith('/police') && role !== 'Police') {
        // Redirect unauthorized "police" role access
        return NextResponse.redirect(new URL('/login', req.url));
        }
  }

  return NextResponse.next();
}
