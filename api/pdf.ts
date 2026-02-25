import { pdfLanguage, pdfType } from "@/types/interfaces";
import apiFetch from "./client";

export const fetchPdfs = () => {
    return apiFetch("/api/pdfs");
}

export const fetchPdf = (pdfFileId: string) => {
    return apiFetch(`/api/pdfs/${pdfFileId}`);
}

export const createPdf = ({ fileId, title, author, description, language, type, total_pages, pages_read }: { fileId: string, title: string, author: string, description: string, language: pdfLanguage, type: pdfType, total_pages: number, pages_read: number }) => {
    return apiFetch("/api/pdfs", {
        method: "POST",
        body: JSON.stringify({
            fileId,
            title,
            author,
            description,
            language,
            type,
            total_pages,
            pages_read
        })
    })
}

export const deletePdf = ({ fileId }: { fileId: string }) => {
    return apiFetch(`api/pdfs/${fileId}`, { method: "DELETE" });
}