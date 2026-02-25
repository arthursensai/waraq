import type { SupabaseClient } from "@supabase/supabase-js";
import { pdfFileSchema, pdfDocumentSchema, pdfDetails } from "@/types/interfaces";
import utapi from "@/lib/uploadThing/uploadThing";

export const uploadPdf = async ({ file }: { file: File }) => {
    const { data, error } = await utapi.uploadFiles(file);

    if (error) {
        throw new Error(`Upload PDF error: ${error.message}`);
    }

    return data;
};

export const uploadPdfFile = async ({ url, userId, supabase, key }: pdfFileSchema) => {
    const { data, error } = await supabase.from("pdf_files").insert({
        url,
        user_id: userId,
        status: "pending",
        key
    }).select();

    if (error) {
        throw new Error(`Upload PDF file Error: ${error.message}`);
    }

    return { id: data?.[0]?.id };
};

export const uploadPdfDocument = async ({ file_id, user_id, title, author, description, supabase, language, type, total_pages, pages_read }: pdfDocumentSchema) => {
    const { data, error } = await supabase.from("pdf_documents").insert({ file_id, user_id, title, author, description, language, type, total_pages: total_pages, pages_read: pages_read });

    if (error) {
        throw new Error(`Upload PDF document Error: ${error.message}`);
    }

    return data;
};

export const getPdfDocuments = async ({ supabase }: { supabase: SupabaseClient }) => {

    const { data, error } = await supabase
        .from("pdf_documents")
        .select("title, author, description, file_id, language, total_pages, pages_read");

    if (error) {
        throw new Error(`Fetching PDFs documents Error: ${error.message}`);
    }

    return data;
};


export const getPdfDetails = async ({ supabase, id }: { supabase: SupabaseClient, id: string }): Promise<pdfDetails> => {

    const { data: pdfFileData, error: fileError } = await supabase
        .from("pdf_files")
        .select("id, key, url").eq("id", id).single();

    const { data: pdfDocumentData, error: documentError } = await supabase
        .from("pdf_documents")
        .select("title, author, description, language, type, total_pages, pages_read").eq("file_id", id).single();


    if (fileError || documentError) {
        throw new Error(`Fetching PDFs documents Error: ${fileError?.message || documentError?.message}`);
    }

    return {
        id: pdfFileData.id,
        key: pdfFileData.key,
        url: pdfFileData.url,
        title: pdfDocumentData.title,
        author: pdfDocumentData.author,
        description: pdfDocumentData.description,
        language: pdfDocumentData.language,
        type: pdfDocumentData.type,
        total_pages: pdfDocumentData.total_pages,
        pages_read: pdfDocumentData.pages_read
    };
};

export const deletePdf = async ({ supabase, id }: { supabase: SupabaseClient, id: string }) => {
    const { data, error } = await supabase.from("pdf_files").delete().eq("id", id);

    if (error) {
        throw new Error(`Error deleting PDF: ${error.message}`);
    }

    return data;
}