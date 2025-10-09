import { NextRequest, NextResponse } from "next/server";

// 1. Specify protected and public routes
// Add '/dashboard' so any route under /dashboard requires authentication
const protectedRoutes = ["/user", "/police", "/admin", "/dashboard"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
	//Check if the current route is protected or public
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.some(route =>
		path.startsWith(route)
	);
	const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

		// Access cookies directly from the request
		const sessionCookie = req.cookies.get("session")?.value;
		const rolesCookie = req.cookies.get("roles")?.value;

		// Validate token payload expiry (and optionally signature) before
		// considering the session valid. We prefer a lightweight decode of the
		// JWT payload so this works on Edge runtimes. If a verification key is
		// available in env (JWT_SECRET or JWT_PUBLIC_KEY), attempt to verify
		// the signature using `jsonwebtoken`. If verification fails or is not
		// available, fall back to payload expiry check.
		let tokenValid = false;
		if (sessionCookie) {
			try {
				// Basic payload decode (no signature verification). Handle
				// URL-safe base64 (replace '-'/'_' and pad) before decoding.
				const parts = sessionCookie.split(".");
				if (parts.length === 3) {
					let payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
					payloadB64 = payloadB64.padEnd(payloadB64.length + (4 - (payloadB64.length % 4)) % 4, '=');
					const payloadJson = Buffer.from(payloadB64, 'base64').toString('utf8');
					const payload = JSON.parse(payloadJson);
					const now = Math.floor(Date.now() / 1000);
					if (payload && typeof payload.exp === 'number' && payload.exp > now) {
						tokenValid = true;
					}
				}

				// If a verification key/secret is provided, try to verify signature.
				// This step may fail on Edge runtimes if `jsonwebtoken` isn't usable;
				// catch and ignore errors and keep tokenValid based on payload expiry.
				const key = process.env.JWT_PUBLIC_KEY || process.env.JWT_SECRET;
				if (key) {
					try {
						// Dynamically import jsonwebtoken (no top-level await). We handle
						// promise resolution inline; if the module cannot be loaded in the
						// runtime, we silently skip verification and rely on expiry check.
						await import("jsonwebtoken")
							.then((jwtModule) => {
								const jwt = (jwtModule as any).default || jwtModule;
								jwt.verify(sessionCookie, key as string);
								tokenValid = true;
							})
							.catch(() => {
								// import failed, do nothing and keep tokenValid from payload check
							});
					} catch (err) {
						// verification failed or dynamic import unavailable — keep tokenValid only if payload expiry check passed
					}
				}
			} catch (err) {
				tokenValid = false;
			}
		}

		if (isProtectedRoute && (!sessionCookie || !rolesCookie || !tokenValid)) {
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
