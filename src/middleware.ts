import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function hasValidAdminCookie(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) {
    return false;
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!(await hasValidAdminCookie(request))) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
