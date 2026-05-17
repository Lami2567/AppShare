import { NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { createPresignedUploadUrl } from "@/lib/r2";

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
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return unauthorized();
    }

    const body = await request.json();
    const appId = String(body.appId ?? "").trim();
    const versionName = String(body.versionName ?? "").trim();
    const fileName = String(body.fileName ?? "").trim();
    const fileType = String(body.fileType ?? "");
    const fileSize = Number(body.fileSize ?? 0);

    if (!appId || !versionName || !fileName || !fileSize) {
      return NextResponse.json({ error: "App, version, and APK file are required." }, { status: 400 });
    }

    if (!fileName.toLowerCase().endsWith(".apk") || !apkMimeTypes.has(fileType)) {
      return NextResponse.json({ error: "Only APK files are allowed." }, { status: 400 });
    }

    if (fileSize > maxBytes()) {
      return NextResponse.json({ error: "APK exceeds configured size limit." }, { status: 413 });
    }

    const contentType = "application/vnd.android.package-archive";
    const key = `apps/${appId}/${cleanSegment(versionName)}-${crypto.randomUUID()}.apk`;
    const signedUpload = await createPresignedUploadUrl({ key, contentType });

    return NextResponse.json({
      key,
      contentType,
      fileUrl: signedUpload.fileUrl,
      uploadUrl: signedUpload.uploadUrl
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload URL could not be created." },
      { status: 500 }
    );
  }
}
