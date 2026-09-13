import { NextRequest, NextResponse } from "next/server";
import { cleanupOrphanedImages } from "@/lib/cleanupOrphanedImages";

// Triggered daily by the Vercel Cron schedule defined in vercel.json.
// Vercel automatically sends `Authorization: Bearer ${CRON_SECRET}` on cron
// requests when the CRON_SECRET env var is set — this route verifies that
// header so the endpoint can't be triggered by anyone else.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await cleanupOrphanedImages();

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ message: result.message, deleted: result.deleted });
}
