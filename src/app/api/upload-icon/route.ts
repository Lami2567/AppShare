import { NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { uploadFileToR2 } from "@/lib/r2";

const allowedTypes = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"]
]);

const maxIconBytes = 2 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return unauthorized();
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Icon file is required." }, { status: 400 });
    }

    const extension = allowedTypes.get(file.type);
    if (!extension) {
      return NextResponse.json({ error: "Only PNG, JPG, and WebP icons are allowed." }, { status: 400 });
    }

    if (file.size > maxIconBytes) {
      return NextResponse.json({ error: "Icon must be 2 MB or smaller." }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `icons/${crypto.randomUUID()}.${extension}`;
    const url = await uploadFileToR2({
      key,
      body: buffer,
      contentType: file.type
    });

    return NextResponse.json({ url, key }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Icon upload failed." },
      { status: 500 }
    );
  }
}
