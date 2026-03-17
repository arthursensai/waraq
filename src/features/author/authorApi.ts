import { createClient } from "@/lib/supabase/client";
import { uploadFiles } from "@/lib/uploadThing/image-router";
import { AuthorSchemaType } from "./authorSchema";
import { AvalaiblityType } from "@/lib/constants/types";

export const fetchAllAuthors = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("authors")
    .select("id, full_name");

  if (error) throw new Error("Error fetching All authors");

  return data;
};

export const fetchAuthors = async ({ type }: { type: AvalaiblityType }) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(`${type}_authors_view`)
    .select("*")
    .limit(5);

  if (error) throw new Error("Error fetching authors ");

  return data;
};

export const fetchAuthor = async ({
  id,
}: {
  id: string;
}) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("authors_view")
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
}: AuthorSchemaType) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("authors")
    .insert({ full_name, biography, type: "private" })
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

export const updateAuthorImage = async ({
  imageFile,
  authorId,
  imageId,
}: {
  imageFile: File;
  authorId: string;
  imageId: string;
}) => {
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
    .update({
      owner_id: null,
      owner_type: null,
      nulled_at: new Date().toISOString(),
    })
    .eq("owner_id", authorId)
    .eq("owner_type", "author");

  const { data, error } = await supabase
    .from("images")
    .insert({
      key: fileData.key,
      url: fileData.ufsUrl,
      owner_id: authorId,
      owner_type: "author",
    })
    .select()
    .single();

  if (error) throw new Error("Error updating author's image");

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
