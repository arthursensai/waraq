import { createClient } from "@/lib/supabase/client";
import { uploadFiles } from "@/lib/uploadThing/image-router";

export const fetchProfile = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profile_with_image")
    .select("*")
    .single();

  if (error) {
    throw new Error("error getting user's profile");
  }

  return data;
};

export const updateImage = async (
  imageFile: File,
  profileId: string,
  imageId: string,
) => {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error("No user session found");

  const res = await uploadFiles("imageUploader", {
    files: [imageFile],
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res[0]) throw new Error("Upload failed");

  const fileData = res[0];

  await supabase
    .from("images")
    .update({ owner_id: null, owner_type: null })
    .eq("id", imageId);

  const { data, error } = await supabase
    .from("images")
    .insert({
      key: fileData.key,
      url: fileData.ufsUrl,
      owner_id: profileId,
      owner_type: "profile",
    })
    .select()
    .single();

  if (error) throw new Error("Error updating user's profile");

  return data;
};

export const updateProfile = async ({ username, profile_id }: { username: string, profile_id: string }) => {
  const supabase = createClient();


  const { data, error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", profile_id);

  if (error) {
    throw new Error("error updating user's profile");
  }

  return data;
};
