import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { createVersion } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return unauthorized();
    }

    const body = await request.json();
    const appId = String(body.appId ?? "").trim();
    const versionName = String(body.versionName ?? "").trim();
    const changelog = String(body.changelog ?? "").trim();
    const fileUrl = String(body.fileUrl ?? "").trim();
    const fileKey = String(body.fileKey ?? "").trim();
    const fileSize = Number(body.fileSize ?? 0);
    const downloadPassword = String(body.downloadPassword ?? "").trim();

    if (!appId || !versionName || !fileUrl || !fileKey || !fileSize) {
      return NextResponse.json({ error: "Upload metadata is incomplete." }, { status: 400 });
    }

    const version = await createVersion({
      appId,
      versionName,
      changelog,
      fileUrl,
      fileKey,
      fileSize,
      downloadPasswordHash: downloadPassword ? await bcrypt.hash(downloadPassword, 12) : null
    });

    return NextResponse.json({ version }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Uploaded version could not be saved." },
      { status: 500 }
    );
  }
}
