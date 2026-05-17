import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const cookieName = "admin_token";

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    throw new Error("AUTH_SECRET is not configured.");
  }
  return new TextEncoder().encode(value);
}

export async function createAdminToken(admin: { id: string; email: string }) {
  return new SignJWT({ email: admin.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(admin.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifyAdminToken(token?: string) {
  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, secret());
    return {
      id: verified.payload.sub,
      email: verified.payload.email
    };
  } catch {
    return null;
  }
}

export async function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function getCookieToken() {
  const cookieStore = await cookies();
  return cookieStore.get(cookieName)?.value;
}

export async function requireAdmin() {
  const admin = await verifyAdminToken(await getCookieToken());
  if (!admin?.id) {
    return null;
  }
  return admin;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function adminFromRequest(request: NextRequest) {
  return verifyAdminToken(request.cookies.get(cookieName)?.value);
}
