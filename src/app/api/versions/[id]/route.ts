import { NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { deleteVersion } from "@/lib/db";
import { deleteFromR2 } from "@/lib/r2";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return unauthorized();
  }

  const { id } = await context.params;
  const deleted = await deleteVersion(id);
  if (!deleted) {
    return NextResponse.json({ error: "Version not found." }, { status: 404 });
  }

  await deleteFromR2(deleted.file_key);
  return NextResponse.json({ ok: true });
}
