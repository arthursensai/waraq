import { createClient } from "@/lib/supabase/client";
import { uploadFiles } from "@/lib/uploadThing/image-router";
import { AuthorSchema } from "./authorSchema";

export const fetchAuthors = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("author_with_image").select("*");

  if (error) throw new Error("Error fetching user's authors ");

  return data;
};

export const fetchAuthor = async (id: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("author_with_image")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error("Error fetching author");

  return data;
};

export const createAuthor = async ({
  full_name,
  biography,
  image_file,
}: AuthorSchema) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("authors")
    .insert({ full_name, biography })
    .select()
    .single();

  const { id } = await uploadAuthorImage(image_file, data.id);

  if (error) throw new Error("Error creating Author");

  return data;
};

export const uploadAuthorImage = async (
  imageFile: File | null,
  ownerId: string,
) => {
  const supabase = createClient();

  let fileData = {
    key: "q82Vr30TzpBSqDpZTmL30TzpBSXxfW5FIJdAwnM43hyLiZDj",
    ufsUrl:
      "https://ig2vaaxsyw.ufs.sh/f/q82Vr30TzpBSqDpZTmL30TzpBSXxfW5FIJdAwnM43hyLiZDj",
  };

  if (imageFile instanceof File) {
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

    fileData = res[0];
  }

  const { data, error } = await supabase
    .from("images")
    .insert({
      key: fileData.key,
      url: fileData.ufsUrl,
      owner_id: ownerId,
      owner_type: "author",
    })
    .select()
    .single();

  if (error) throw new Error("Error adding author image");

  return data;
};

export const updateAuthor = async ({
  id,
  full_name,
  biography,
}: {
  id: string;
  full_name: string;
  biography: string;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("authors")
    .update({ full_name, biography })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error("Error updating author details");

  return data;
};

export const deleteAuthor = async (id: string) => {
  const supabase = createClient();
  await supabase
    .from("images")
    .delete()
    .eq("owner_id", id)
    .eq("owner_type", "author");
  const { data, error } = await supabase.from("authors").delete().eq("id", id);

  if (error) throw new Error("Error deleting Author");

  return data;
};
