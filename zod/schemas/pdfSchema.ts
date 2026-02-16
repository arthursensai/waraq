import * as z from "zod";

export const Pdf = z.object({
    title: z.string()
        .min(3, "SHORT_TITLE_ERROR")
        .max(54, "LONG_TITLE_ERROR"),
    author: z.string()
        .min(3, "MIN_author_ERROR")
        .max(54, "LONG_author_ERROR"),
});


export type Pdf = z.infer<typeof Pdf>;

const ERROR_MESSAGES: Record<string, string> = {
    LONG_TITLE_ERROR: "Title is too long.",
    SHORT_TITLE_ERROR: "Title is too short.",
    LONG_author_ERROR: "Author name is too long.",
    MIN_author_ERROR: "Author name is too short.",
};

export const parseZodErrors = (error: z.ZodError<Pdf>): Record<string, string> => {
    const errors: Record<string, string> = {};

    error.issues.forEach((err) => {
        const field = err.path[0] as string;
        const code = err.message;

        if (field) {
            errors[field] = ERROR_MESSAGES[code] ?? "Unknown error";
        }
    });

    return errors;
};
