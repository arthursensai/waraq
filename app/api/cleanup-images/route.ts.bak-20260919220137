import { NextRequest, NextResponse } from "next/server";
import { cleanupOrphanedImages } from "@/lib/cleanupOrphanedImages";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-api-secret");
  if (!process.env.CLEANUP_API_SECRET || secret !== process.env.CLEANUP_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await cleanupOrphanedImages();

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ message: result.message, deleted: result.deleted });
}
