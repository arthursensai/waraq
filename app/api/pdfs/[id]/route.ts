import { deletePdf, getPdfDetails } from "@/lib/supabase/queries/pdfs";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest,
    { params }: RouteContext<"/api/pdfs/[id]">) => {

    const { id } = await params;

    if (!id) return NextResponse.json({ error: "No valid pdf Id" }, { status: 404 });

    const supabase = await createClient();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    const { data, error } = token
        ? await supabase.auth.getUser(token)
        : await supabase.auth.getUser();

    if (error || !data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const pdfDetails = await getPdfDetails({ supabase, id });
        return NextResponse.json(pdfDetails, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export const DELETE = async (req: NextRequest, { params }: RouteContext<"/api/pdfs/[id]">) => {
    const { id } = await params;

    if (!id) return NextResponse.json({ error: "No valid pdf Id" }, { status: 404 });

    const supabase = await createClient();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    const { data, error } = token
        ? await supabase.auth.getUser(token)
        : await supabase.auth.getUser();

    if (error || !data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await deletePdf({ supabase, id });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}