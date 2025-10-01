import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token");

  if (
    (request.nextUrl.pathname.startsWith("/config") ||
      request.nextUrl.pathname.startsWith("/api/config")) &&
    !authToken
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
