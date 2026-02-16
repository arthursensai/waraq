import type { SupabaseClient } from "@supabase/supabase-js";

type pdfStatus = "pending" | "completed";

interface pdfFileSchema {
    url: string;
    userId: string;
    supabase: SupabaseClient;
}

interface pdfDocumentSchema {
    file_id: string;
    user_id: string;
    title: string;
    author: string;
    description: string;
    supabase: SupabaseClient;
}

export const uploadPdfFile = async ({ url, userId, supabase }: pdfFileSchema) => {
    const { data, error } = await supabase.from("pdf_files").insert({
        url,
        user_id: userId,
        status: "pending",
    }).select();

    if (error) throw new Error(error.message);

    return { id: data?.[0]?.id };
};

export const uploadPdfDocument = async ({ file_id, title, author, description, supabase, user_id }: pdfDocumentSchema) => {
    const { data, error } = await supabase.from("pdf_documents").insert({ file_id, title, author, description, user_id });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};