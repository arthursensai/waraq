import { uploadPdfDocument, uploadPdfFile } from "@/lib/supabase/queries/pdfs";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const supabase = await createClient();
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    const { data, error } = token
        ? await supabase.auth.getUser(token)
        : await supabase.auth.getUser();

    if (error || !data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, author, description, pdf_url } = await req.json();

    try {
        const uploadPdfFileRes = await uploadPdfFile({ url: pdf_url, userId: data.user.id, supabase });
        await uploadPdfDocument({ file_id: uploadPdfFileRes.id, title, author, description, user_id: data.user.id, supabase });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
