import { NextResponse } from "next/server";
import { createVersion } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { uploadApkToR2 } from "@/lib/r2";

const apkMimeTypes = new Set([
  "application/vnd.android.package-archive",
  "application/octet-stream",
  "application/zip",
  ""
]);

function maxBytes() {
  const mb = Number(process.env.MAX_UPLOAD_MB ?? 250);
  return mb * 1024 * 1024;
}

function cleanSegment(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return unauthorized();
  }

  const formData = await request.formData();
  const appId = String(formData.get("appId") ?? "").trim();
  const versionName = String(formData.get("versionName") ?? "").trim();
  const changelog = String(formData.get("changelog") ?? "").trim();
  const file = formData.get("file");

  if (!appId || !versionName || !(file instanceof File)) {
    return NextResponse.json({ error: "App, version, and APK file are required." }, { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(".apk") || !apkMimeTypes.has(file.type)) {
    return NextResponse.json({ error: "Only APK files are allowed." }, { status: 400 });
  }

  if (file.size > maxBytes()) {
    return NextResponse.json({ error: "APK exceeds configured size limit." }, { status: 413 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const isZipBasedApk = buffer[0] === 0x50 && buffer[1] === 0x4b;

  if (!isZipBasedApk) {
    return NextResponse.json({ error: "Invalid APK binary signature." }, { status: 400 });
  }

  const key = `apps/${appId}/${cleanSegment(versionName)}-${crypto.randomUUID()}.apk`;
  const fileUrl = await uploadApkToR2({
    key,
    body: buffer,
    contentType: "application/vnd.android.package-archive"
  });

  const version = await createVersion({
    appId,
    versionName,
    changelog,
    fileUrl,
    fileKey: key,
    fileSize: file.size
  });

  return NextResponse.json({ version }, { status: 201 });
}
