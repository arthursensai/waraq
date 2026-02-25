import { createClient } from "@/lib/supabase/client";

const apiFetch = async <T>(
    url: string,
    options: RequestInit = {}
): Promise<T> => {
    const supabase = createClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(session?.access_token
                ? { Authorization: `Bearer ${session.access_token}` }
                : {}),
        },
    });

    if (!res.ok) {
        throw new Error("API Error");
    }

    return res.json();
}

export default apiFetch;