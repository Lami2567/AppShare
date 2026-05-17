import { NextResponse } from "next/server";
import { createApp, listApps } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/auth";

export async function GET() {
  try {
    const apps = await listApps();
    return NextResponse.json({ apps });
  } catch (error) {
    return NextResponse.json({ apps: [], error: error instanceof Error ? error.message : "Database error" }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return unauthorized();
    }

    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const description = String(body.description ?? "").trim();
    const iconUrl = String(body.iconUrl ?? "").trim() || null;

    if (!name) {
      return NextResponse.json({ error: "App name is required." }, { status: 400 });
    }

    const app = await createApp({ name, description, iconUrl });
    return NextResponse.json({ app }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "App could not be created." },
      { status: 500 }
    );
  }
}
