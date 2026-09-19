import { createAdminClient } from "@/lib/supabase/server";
import utapi from "@/lib/uploadThing";
import nodemailer from "nodemailer";

const escapeHtml = (value: unknown): string =>
  String(value ?? "—")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export type CleanupResult =
  | { ok: true; deleted: number; message: string }
  | { ok: false; error: string };

export const cleanupOrphanedImages = async (): Promise<CleanupResult> => {
  const supabase = createAdminClient();

  const { data: orphanedImages, error } = await supabase
    .from("images")
    .select("id, key, owner_type, nulled_at")
    .eq("type", "private")
    .is("owner_id", null);

  if (error) {
    return { ok: false, error: "Failed to fetch orphaned images" };
  }

  if (!orphanedImages || orphanedImages.length === 0) {
    return { ok: true, deleted: 0, message: "No orphaned images found" };
  }

  const keys = orphanedImages.map((img) => img.key);
  await utapi.deleteFiles(keys);

  const ids = orphanedImages.map((img) => img.id);
  const { error: deleteError } = await supabase
    .from("images")
    .delete()
    .in("id", ids);

  if (deleteError) {
    return { ok: false, error: "Failed to delete image records" };
  }

  // Best-effort notification email — failures here shouldn't fail the job.
  try {
    if (process.env.GMAIL_USER && process.env.GMAIL_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: `"Waraq Cleanup" <${process.env.GMAIL_USER}>`,
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
                  <td>${escapeHtml(img.id)}</td>
                  <td>${escapeHtml(img.key)}</td>
                  <td>${escapeHtml(img.owner_type)}</td>
                  <td>${escapeHtml(img.nulled_at)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        `,
      });
      console.log("✅ Cleanup email sent:", info.response);
    }
  } catch (emailError) {
    console.error("❌ Cleanup email failed:", emailError);
  }

  return {
    ok: true,
    deleted: orphanedImages.length,
    message: `Cleaned up ${orphanedImages.length} orphaned images`,
  };
};
