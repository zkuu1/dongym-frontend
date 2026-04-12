import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  id: number;
  name: string;
  role: string;
};

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // 1. Capture token from URL (if coming from OAuth redirect)
  const urlToken = searchParams.get("token");
  if (urlToken) {
    const response = NextResponse.redirect(new URL(pathname, request.url));
    response.cookies.set("token", urlToken, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: false, // accessible via client-side if needed
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }

  const token = request.cookies.get("token")?.value;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const isAdminPage = pathname.startsWith("/admin");
  const isUserPage = pathname.startsWith("/user");
  const isRootPage = pathname === "/";

  // 2. Redirect to login if accessing protected pages without token
  if (!token && (isAdminPage || isUserPage)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Handle logged-in user redirection
  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const role = decoded.role?.toLowerCase(); // Case-insensitive role normalization

      // Ensure role is recognized
      if (role !== "admin" && role !== "user") {
        console.error("Middleware Auth Error: Unrecognized role", role);
        throw new Error("Unrecognized role");
      }

      // If user visits /login or /register while logged in, redirect to their dashboard
      if (isAuthPage) {
        return NextResponse.redirect(
          new URL(role === "admin" ? "/admin" : "/user", request.url)
        );
      }

      // Logic role protection: prevent users from accessing wrong dashboard
      if (isAdminPage && role !== "admin") {
        return NextResponse.redirect(new URL("/user", request.url));
      }

      if (isUserPage && role !== "user") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } catch (error) {
       // If already on login page, don't redirect again to avoid loop
       if (isAuthPage) return NextResponse.next();

      // If token is invalid or role unrecognized, clear it and redirect to login
      console.error("Middleware Auth Catch:", error);
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/login", "/register", "/"],
};