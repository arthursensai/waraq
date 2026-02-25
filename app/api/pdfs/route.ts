import { getPdfDocuments, uploadPdfDocument } from "@/lib/supabase/queries/pdfs";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const supabase = await createClient();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    const { data, error } = token
        ? await supabase.auth.getUser(token)
        : await supabase.auth.getUser();

    if (error || !data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const pdfDocuments = await getPdfDocuments({ supabase });
        return NextResponse.json(pdfDocuments, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export const POST = async (req: NextRequest) => {
    const supabase = await createClient();
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    const { data, error } = token
        ? await supabase.auth.getUser(token)
        : await supabase.auth.getUser();

    if (error || !data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { fileId, title, author, description, language, type, total_pages, pages_read } = await req.json();

    const fileIdNumber = typeof fileId === "string" ? Number(fileId) : fileId;
    if (!Number.isFinite(fileIdNumber)) {
        return NextResponse.json({ error: "Invalid fileId" }, { status: 400 });
    }

    try {
        await uploadPdfDocument({ file_id: fileIdNumber, user_id: data.user.id, supabase, title, author, description, language, type, total_pages, pages_read });
        await supabase.from("pdf_files").update({ status: "completed" }).eq("id", fileId);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
