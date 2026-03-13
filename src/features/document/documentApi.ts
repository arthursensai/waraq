import { createClient } from "@/lib/supabase/client";
import { DocumentType } from "./documentSchema";

export const fetchDocuments = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("documents_view").select("*");

  if (error) throw new Error("Error fetching documents");

  return data;
};

export const fetchDocument = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("documents_view")
    .select("*")
    .eq("id", id).single();

  if (error) throw new Error("Error fetching documents");

  return data;
};

export const uploadFile = async (documentFile: File) => {
  const supabase = createClient();

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      throw new Error("No user session found");
    }

    const token = session.access_token;

    const formData = new FormData();
    formData.append("file", documentFile);

    const res = await fetch("/api/documents/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Upload failed");
    }

    return data;
  } catch (err: any) {
    console.error("Upload API error:", err);
    throw new Error(err?.message || "API error");
  }
};

export const createDocument = async (document: DocumentType) => {
  const supabase = createClient();

  try {
    const { id, tags, ...documentPayload } = document;
    const { data: documentData, error: insertError } = await supabase
      .from("documents")
      .insert(documentPayload)
      .select()
      .single();

    if (insertError || !documentData) {
      throw new Error("Error creating your document");
    }

    const { error: updateError } = await supabase
      .from("files")
      .update({ status: "completed" })
      .eq("id", document.file_id);

    if (updateError) {
      console.warn(
        `Document created but failed to update file status for file_id=${document.file_id}`,
      );
    }

    return documentData;
  } catch (err: any) {
    console.error("createDocument error:", err);
    throw new Error(err.message || "Error creating document");
  }
};
