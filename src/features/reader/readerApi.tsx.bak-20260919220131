import { createClient } from "@/lib/supabase/client";

export const fetchFile = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("documents_view")
    .select("file_url, read_page")
    .eq("id", id)
    .single();

  if (error) throw new Error("Error fetching documents");

  return data;
};

export const updateCurrentPage = async ({
  id,
  newPage,
}: {
  id: string;
  newPage: number;
}) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("documents")
    .update({ read_page: newPage })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error("Error saving your file");

  return data;
};
