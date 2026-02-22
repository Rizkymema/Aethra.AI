import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// TODO: Replace with real auth session check (e.g. next-auth getToken)
function getMockSession(request: NextRequest) {
  // In production, validate a cookie / JWT here
  const isLoggedIn = request.cookies.get("aethra-session")?.value === "true";
  const isAdmin = request.cookies.get("aethra-role")?.value === "admin";
  return { isLoggedIn, isAdmin };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { isLoggedIn, isAdmin } = getMockSession(request);

  // ── Public routes — always accessible ──
  if (
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ── Dashboard routes — require auth ──
  // TODO: implement role-check middleware
  // When real auth is wired up, uncomment the block below:
  //
  // if (!isLoggedIn) {
  //   const loginUrl = new URL("/auth", request.url);
  //   loginUrl.searchParams.set("redirect", pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  // ── Admin routes — require admin role ──
  // if (pathname.startsWith("/admin") && !isAdmin) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
