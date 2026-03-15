import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode"

type TokenPayload = {
  id: number;
  name: string;
  role: string;
};

export function middleware(request: NextRequest) {

  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  const isAdminPage = pathname.startsWith("/admin");
  const isUserPage = pathname.startsWith("/user");

  if (!token && (isAdminPage || isUserPage)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {

    const decoded = jwtDecode<TokenPayload>(token);
    const role = decoded.role;

    // hanya admin boleh ke /admin
    if (isAdminPage && role !== "admin") {
      return NextResponse.redirect(new URL("/user", request.url));
    }

    // hanya user boleh ke /user
    if (isUserPage && role !== "user") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (isAuthPage) {
      return NextResponse.redirect(new URL("/user", request.url));
    }

  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/login",
    "/register"
  ],
};