import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import utapi from "@/lib/uploadThing";
import nodemailer from "nodemailer";

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

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  // Send notification email
  try {
    const info = await transporter.sendMail({
      from: `"Waraq Cleanup" <${process.env.GMAIL_USER}>`,
      to: process.env.CLEANUP_NOTIFICATION_EMAIL!,
      subject: `🗑️ Cleanup Report — ${orphanedImages.length} image(s) deleted`,
      html: `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:#1a1a1a;border-radius:12px;overflow:hidden;border:1px solid #2a2a2a;">
        
        <!-- Header -->
        <div style="background:#c0502a;padding:28px 32px;">
          <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600;letter-spacing:-0.3px;">
            🗑️ Waraq Cleanup Report
          </h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">
            ${new Date().toUTCString()}
          </p>
        </div>

        <!-- Summary -->
        <div style="padding:24px 32px;border-bottom:1px solid #2a2a2a;">
          <div style="display:inline-block;background:#2a2a2a;border-radius:8px;padding:16px 24px;text-align:center;">
            <div style="font-size:36px;font-weight:700;color:#c0502a;line-height:1;">
              ${orphanedImages.length}
            </div>
            <div style="font-size:12px;color:#888;margin-top:4px;text-transform:uppercase;letter-spacing:0.05em;">
              Images Deleted
            </div>
          </div>
        </div>

        <!-- Table -->
        <div style="padding:24px 32px;">
          <p style="margin:0 0 16px;font-size:13px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.05em;">
            Deleted Records
          </p>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <thead>
              <tr style="background:#2a2a2a;">
                <th style="padding:10px 12px;text-align:left;color:#888;font-weight:500;border-radius:6px 0 0 6px;">Owner Type</th>
                <th style="padding:10px 12px;text-align:left;color:#888;font-weight:500;">Key</th>
                <th style="padding:10px 12px;text-align:left;color:#888;font-weight:500;border-radius:0 6px 6px 0;">Nulled At</th>
              </tr>
            </thead>
            <tbody>
              ${orphanedImages
                .map(
                  (img, i) => `
                <tr style="border-bottom:1px solid #2a2a2a;background:${i % 2 === 0 ? "transparent" : "#1f1f1f"};">
                  <td style="padding:10px 12px;color:#e0e0e0;">
                    <span style="background:#2a2a2a;padding:2px 8px;border-radius:4px;font-size:11px;color:#c0502a;font-weight:500;">
                      ${img.owner_type ?? "—"}
                    </span>
                  </td>
                  <td style="padding:10px 12px;color:#888;font-family:monospace;font-size:11px;">
                    ${img.key.slice(0, 24)}...
                  </td>
                  <td style="padding:10px 12px;color:#888;font-size:12px;">
                    ${img.nulled_at ? new Date(img.nulled_at).toUTCString() : "—"}
                  </td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div style="padding:16px 32px;border-top:1px solid #2a2a2a;text-align:center;">
          <p style="margin:0;font-size:12px;color:#555;">
            Waraq · Automated Cleanup System
          </p>
        </div>

      </div>
    </body>
  </html>
`,
    });
    console.log("✅ Email sent:", info.response);
  } catch (emailError) {
    console.error("❌ Email failed:", emailError);
  }

  return NextResponse.json({
    message: `Cleaned up ${orphanedImages.length} orphaned images`,
    deleted: orphanedImages.length,
  });
}
