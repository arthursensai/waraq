import { createClient } from "../client";

interface pdfSchema {
    title: string;
    author: string;
    pdf_link: string;
    user_id: string;
}

export const addNewPdf = async ({ title, author, pdf_link, user_id }: pdfSchema) => {
    const supabase = await createClient()
    const { data, error } = await supabase.from("pdfs").insert({ title, author, pdf_link, user_id });

    if (error) {
        return console.log(error);
    } else {
        return true;
    }
};