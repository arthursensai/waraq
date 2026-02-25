import { SupabaseClient } from "@supabase/supabase-js";

export type pdfLanguage = "en" | "ar" | "de";
export type pdfType = "book" | "novel" | "document";

export type LibraryFilters = {
    language?: pdfLanguage;
}

export interface profileSchema {
    username: string;
    image: string;
}

export interface pdfFileSchema {
    url: string;
    userId: string;
    key: string;
    supabase: SupabaseClient;
}

export interface pdfDocumentSchema {
    file_id: number;
    user_id: string;
    title: string;
    author: string;
    description: string;
    cover_url?: string;
    supabase: SupabaseClient;
    language: pdfLanguage;
    type: pdfType;
    total_pages: number;
    pages_read: number;
}

export interface pdfDetails {
    id: string;
    key: string;
    url: string;
    title: string;
    author: string;
    description: string;
    language: pdfLanguage;
    type: pdfType;
    total_pages: number;
    pages_read: number;
};

export type UploadFileResponse =
    | { data: UploadData; error: null }
    | { data: null; error: UploadError };

export type UploadData = {
    key: string;
    url: string;
    name: string;
    size: number;
};

export type UploadError = {
    code: string;
    message: string;
    data: any;
};
