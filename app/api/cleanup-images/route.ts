import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import utapi from "@/lib/uploadThing";

export const POST = async (req: NextRequest) => {
  const secret = req.headers.get("x-api-secret");
  if (secret !== process.env.CLEANUP_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: orphanedImages, error } = await supabase
    .from("images")
    .select("id, key")
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

  return NextResponse.json({
    message: `Cleaned up ${orphanedImages.length} orphaned images`,
    deleted: orphanedImages.length,
  });
};
