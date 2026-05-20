import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/auth";
import { getVersionForDownload } from "@/lib/db";
import { getDownloadUrl } from "@/lib/r2";

async function getResolvedUrl(version: { file_url: string; file_key?: string | null }) {
  return getDownloadUrl(
    version.file_key ? `r2://${process.env.R2_BUCKET_NAME}/${version.file_key}` : version.file_url
  );
}

async function resolveVersion(id: string) {
  const version = await getVersionForDownload(id);
  if (!version) {
    return null;
  }

  return version;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const version = await resolveVersion(id);
    if (!version) {
      return NextResponse.json({ error: "Version not found." }, { status: 404 });
    }

    const admin = await requireAdmin();
    if (version.download_password_hash && !admin) {
      return NextResponse.json({ error: "Password is required." }, { status: 403 });
    }

    return NextResponse.redirect(await getResolvedUrl(version));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Download could not be prepared." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const version = await resolveVersion(id);
    if (!version) {
      return NextResponse.json({ error: "Version not found." }, { status: 404 });
    }

    if (version.download_password_hash) {
      const body = await request.json().catch(() => ({}));
      const password = String(body.password ?? "");
      if (!password || !(await bcrypt.compare(password, version.download_password_hash))) {
        return NextResponse.json({ error: "Incorrect download password." }, { status: 401 });
      }
    }

    return NextResponse.json({ url: await getResolvedUrl(version) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Download could not be prepared." },
      { status: 500 }
    );
  }
}
