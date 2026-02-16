import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { cache } from "react";

export const getUserProfile = cache(async () => {

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("users")
        .select("username, image")
        .single();

    if (error || !data) {
        redirect("/auth/login");
    }

    return data;
});