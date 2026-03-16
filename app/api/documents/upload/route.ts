import { NextResponse } from "next/server";
import { saveFile } from "@/src/features/files/filesApi";
import { checkAuth } from "@/handlers/checkAuth";
import MuPDF from "mupdf";

const MAX_SIZE_MB = 8;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const extractPdfCover = async (buffer: ArrayBuffer): Promise<File> => {
  const doc = MuPDF.Document.openDocument(buffer, "application/pdf");
  const page = doc.loadPage(0);
  const pixmap = page.toPixmap([1, 0, 0, 1, 0, 0], MuPDF.ColorSpace.DeviceRGB);
  const pngBytes = pixmap.asPNG();
  const pngBuffer = pngBytes.buffer as ArrayBuffer;
  return new File([pngBuffer], "cover.png", { type: "image/png" });
};

export const POST = checkAuth(async ({ req, supabase }) => {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file)
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  if (file.type !== "application/pdf")
    return NextResponse.json({ error: "Only PDFs allowed" }, { status: 400 });
  if (file.size > MAX_SIZE_BYTES)
    return NextResponse.json(
      { error: `File too large. Max ${MAX_SIZE_MB}MB allowed.` },
      { status: 400 },
    );

  const buffer = await file.arrayBuffer();

  const doc = MuPDF.Document.openDocument(buffer, "application/pdf");
  const documentTotalPages = doc.countPages();

  try {
    const savedFile = await saveFile(file);
    const coverFile = await extractPdfCover(buffer);
    const savedCover = await saveFile(
      coverFile,
      `cover_${file.name.replace(".pdf", "")}.png`,
    );

    const { data } = await supabase
      .from("files")
      .insert({ key: savedFile.key, url: savedFile.ufsUrl })
      .select()
      .single();

    const { data: coverData } = await supabase
      .from("images")
      .insert({ key: savedCover.key, url: savedCover.ufsUrl })
      .select()
      .single();

    return NextResponse.json(
      {
        fileId: data.id,
        totalPages: documentTotalPages,
        coverId: coverData.id,
        coverUrl: savedCover.ufsUrl,
      },
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
