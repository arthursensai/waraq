import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import utapi from "@/lib/uploadThing";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-api-secret");
  if (secret !== process.env.CLEANUP_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: orphanedImages, error } = await supabase
    .from("images")
    .select("id, key, owner_type, nulled_at")
    .is("owner_id", null);

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch orphaned images" },
      { status: 500 },
    );
  }

  if (!orphanedImages || orphanedImages.length === 0) {
    return NextResponse.json({ message: "No orphaned images found" });
  }

  const keys = orphanedImages.map((img) => img.key);
  await utapi.deleteFiles(keys);

  const ids = orphanedImages.map((img) => img.id);
  const { error: deleteError } = await supabase
    .from("images")
    .delete()
    .in("id", ids);

  if (deleteError) {
    return NextResponse.json(
      { error: "Failed to delete image records" },
      { status: 500 },
    );
  }

  // Send notification email
  await resend.emails.send({
    from: "Waraq Cleanup <onboarding@resend.dev>",
    to: process.env.CLEANUP_NOTIFICATION_EMAIL!,
    subject: `🗑️ Cleanup Report — ${orphanedImages.length} image(s) deleted`,
    html: `
      <h2>Cleanup Job Report</h2>
      <p><strong>Time:</strong> ${new Date().toUTCString()}</p>
      <p><strong>Total deleted:</strong> ${orphanedImages.length}</p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Key</th>
            <th>Owner Type</th>
            <th>Nulled At</th>
          </tr>
        </thead>
        <tbody>
          ${orphanedImages
            .map(
              (img) => `
            <tr>
              <td>${img.id}</td>
              <td>${img.key}</td>
              <td>${img.owner_type ?? "—"}</td>
              <td>${img.nulled_at ?? "—"}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `,
  });

  return NextResponse.json({
    message: `Cleaned up ${orphanedImages.length} orphaned images`,
    deleted: orphanedImages.length,
  });
}
