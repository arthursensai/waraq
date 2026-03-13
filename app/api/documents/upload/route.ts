import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { saveFile } from "@/src/features/files/filesApi";
import { checkAuth } from "@/handlers/checkAuth";

const MAX_SIZE_MB = 8;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export const POST = checkAuth(async (req, supabase) => {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (file.type !== "application/pdf")
    return NextResponse.json({ error: "Only PDFs allowed" }, { status: 400 });
  if (file.size > MAX_SIZE_BYTES)
    return NextResponse.json(
      { error: `File too large. Max ${MAX_SIZE_MB}MB allowed.` },
      { status: 400 },
    );

  const documentTotalPages = (
    await PDFDocument.load(await file.arrayBuffer())
  ).getPageCount();

  try {
    const savedFile = await saveFile(file);
    const { data, error } = await supabase
      .from("files")
      .insert({ key: savedFile.key, url: savedFile.ufsUrl })
      .select()
      .single();

    return NextResponse.json(
      { fileId: data.id, totalPages: documentTotalPages },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
});
