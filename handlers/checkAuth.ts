import { createClient } from "@/lib/supabase/server";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

type AuthHandler<T> = (
  req: NextRequest,
  supabase: SupabaseClient,
  user: User,
  context: T,
) => Promise<NextResponse>;

export const checkAuth = <T>(handler: AuthHandler<T>) => {
  return async (req: NextRequest, context: T) => {
    const supabase = await createClient();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    const { data, error } = token
      ? await supabase.auth.getUser(token)
      : await supabase.auth.getUser();

    if (error || !data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(req, supabase, data.user, context);
  };
};
