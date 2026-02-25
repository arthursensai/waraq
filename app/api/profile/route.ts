import { getUserProfile, updateUserProfile } from "@/lib/supabase/queries/users";
import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
    const supabase = await createClient();
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    const { data, error } = token
        ? await supabase.auth.getUser(token)
        : await supabase.auth.getUser();

    if (!data || error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await getUserProfile({ supabase, userId: data.user.id });

        return NextResponse.json(user, { status: 200 })
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};

export const PUT = async (req: NextRequest) => {
    const supabase = await createClient();
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    const { data, error } = token
        ? await supabase.auth.getUser(token)
        : await supabase.auth.getUser();

    if (!data || error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username, image } = await req.json();

    try {
        const user = await updateUserProfile({ supabase, userId: data.user.id, username, image });

        return NextResponse.json(user, { status: 200 })
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};