import { createClient } from "../supabase/client";

const checkLogin = async () => {
    const supabase = createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        throw new Error("You must be logged in to upload.");
    }

    return user
};

export default checkLogin;