import apiFetch from "./client";

export const fetchProfile = () => {
    return apiFetch("/api/profile");
};

export const updateProfile = ({ username, image }: { username: string, image: string }) => {
    return apiFetch("/api/profile", {
        method: "PUT",
        body: JSON.stringify({
            username,
            image
        })
    })
}