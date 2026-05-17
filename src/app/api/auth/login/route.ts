import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createAdminToken, setAuthCookie } from "@/lib/auth";
import { getSql } from "@/lib/db";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  const rawPassword = String(password ?? "");

  if (!normalizedEmail || !rawPassword) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const sql = getSql();
  const admins = await sql`
    select id, email, password_hash
    from admins
    where email = ${normalizedEmail}
    limit 1
  `;
  const admin = admins[0] as { id: string; email: string; password_hash: string } | undefined;

  if (!admin || !(await bcrypt.compare(rawPassword, admin.password_hash))) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = await createAdminToken({ id: admin.id, email: admin.email });
  const response = NextResponse.json({ ok: true, admin: { id: admin.id, email: admin.email } });
  await setAuthCookie(response, token);
  return response;
}
