import { SupabaseClient } from "@supabase/supabase-js";

export const getUserProfile = async ({ supabase, userId }: { supabase: SupabaseClient, userId: string }) => {

    const { data, error } = await supabase
        .from("profiles")
        .select("username, image").eq("user_id", userId)
        .single();

    if (error || !data) {
        throw new Error("Unauthorized");
    }

    return data;
};

export const updateUserProfile = async ({ supabase, userId, username, image }: { supabase: SupabaseClient, userId: string, username: string, image: string }) => {

    const { data, error } = await supabase
        .from("profiles").update({ username, image }).eq("user_id", userId).select("username, image");

    console.log(error)
    console.log(data)

    if (error || !data) {
        throw new Error("Unauthorized");
    }

    return data;
};