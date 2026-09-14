import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("better-auth.session_token")?.value;
  const pathname = request.nextUrl.pathname;

  if ((pathname === "/login" || pathname === "/") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    !token &&
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/forms") ||
      pathname.startsWith("/responses") ||
      pathname.startsWith("/create-form"))
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/forms/:path*",
    "/responses/:path*",
    "/create-form/:path*",
    "/login",
    "/",
  ],
};
