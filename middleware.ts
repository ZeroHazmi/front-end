import {NextRequest, NextResponse} from "next/server";
import {cookies, type UnsafeUnwrappedCookies} from "next/headers";
import {decodeToken, getCookie, removeCookie} from "@/app/lib/auth";

// 1. Specify protected and public routes
const protectedRoutes = ["/user", "/police", "/admin"];
const publicRoutes = ["/login", "/signup", "/"];

export default function middleware(req: NextRequest) {
	//Check if the current route is protected or public
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.some(route =>
		path.startsWith(route)
	);
	const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

	// Access cookies directly from the request
	const sessionCookie = req.cookies.get("session")?.value;
	const rolesCookie = req.cookies.get("roles")?.value;

	if (isProtectedRoute && (!sessionCookie || !rolesCookie)) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	// Role-based redirects
	if (path.startsWith("/user") && rolesCookie !== "User") {
		return NextResponse.redirect(new URL("/user", req.url));
	}
	if (path.startsWith("/police") && rolesCookie !== "Police") {
		return NextResponse.redirect(new URL("/police", req.url));
	}
	if (path.startsWith("/police/admin") && rolesCookie !== "Admin") {
		return NextResponse.redirect(new URL("/police", req.url));
	}

	return NextResponse.next();
}
