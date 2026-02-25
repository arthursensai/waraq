import { createUserClient } from "@/lib/supabase/server";
import { uploadPdf, uploadPdfFile } from "@/lib/supabase/queries/pdfs";
import { MAX_SIZE_BYTES, MAX_SIZE_MB } from "@/rules/pdf";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export const POST = async (req: NextRequest) => {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createUserClient(token);
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
        return NextResponse.json(
            { error: "No file uploaded" },
            { status: 400 }
        )
    }

    if (file.type !== "application/pdf") return NextResponse.json({ error: "Only PDFs allowed" }, { status: 400 });
    if (file.size > MAX_SIZE_BYTES) return NextResponse.json({ error: `File too large. Max ${MAX_SIZE_MB}MB allowed.` }, { status: 400 });

    const pdftotal_pages = (await PDFDocument.load(await file.arrayBuffer())).getPageCount();
    console.log(pdftotal_pages)

    try {
        const uploadedFile = await uploadPdf({ file });
        const uploadedPdfFile = await uploadPdfFile({
            userId: data.user.id,
            supabase,
            url: uploadedFile.ufsUrl,
            key: uploadedFile.key,
        });

        return NextResponse.json({ fileId: uploadedPdfFile.id, pdftotal_pages }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
