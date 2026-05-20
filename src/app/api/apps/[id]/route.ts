import { NextResponse } from "next/server";
import { deleteApp, getAppById, updateApp } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { getDownloadUrl } from "@/lib/r2";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const app = await getAppById(id);
    if (!app) {
      return NextResponse.json({ error: "App not found." }, { status: 404 });
    }

    const versions = await Promise.all(
      app.versions.map(async (version) => ({
        ...version,
        file_url: version.has_download_password
          ? null
          : await getDownloadUrl(version.file_key ? `r2://${process.env.R2_BUCKET_NAME}/${version.file_key}` : version.file_url ?? "")
      }))
    );

    return NextResponse.json({ app: { ...app, versions } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Database error" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return unauthorized();
    }

    const { id } = await context.params;
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const description = String(body.description ?? "").trim();
    const iconUrl = String(body.iconUrl ?? "").trim() || null;

    if (!name) {
      return NextResponse.json({ error: "App name is required." }, { status: 400 });
    }

    const app = await updateApp(id, { name, description, iconUrl });
    if (!app) {
      return NextResponse.json({ error: "App not found." }, { status: 404 });
    }
    return NextResponse.json({ app });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "App could not be saved." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return unauthorized();
  }

  const { id } = await context.params;
  await deleteApp(id);
  return NextResponse.json({ ok: true });
}
