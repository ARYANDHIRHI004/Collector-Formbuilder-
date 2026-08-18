import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("better-auth.session_token")?.value;
  const pathname = request.nextUrl.pathname;

  // Logged-in user trying to access login
  if ((pathname === "/login" || pathname === "/" )&& token) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  // Protected routes
  if (
    !token &&
    (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/forms") ||
      pathname.startsWith("/responses")
    )
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
    "/login",
    "/",
  ],
};
