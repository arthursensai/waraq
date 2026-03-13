import * as z from "zod";

export const Document = z.object({
  id: z.uuid(),
  title: z
    .string("Title is required")
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title must be at most 100 characters."),

  author_id: z.uuid("Author ID must be a valid UUID"),
  file_id: z.uuid("Author ID must be a valid UUID"),

  description: z
    .string("Description is required")
    .min(12, "Description must be at least 12 characters.")
    .max(500, "Description must be at most 500 characters."),

  language: z.enum(["en", "ar", "de"], "Language must be 'en', 'ar', or 'de'"),

  type: z.enum(
    ["book", "novel", "document"],
    "Type must be 'book', 'novel', or 'document'",
  ),

  tags: z.array(z.string("tags are required")).default([]).optional(),

  total_pages: z
    .number("Total pages must be a number")
    .positive("Total pages must be greater than 0"),

  read_page: z
    .number("Pages read must be a number")
    .min(0, "Pages read cannot be negative"),
});

export type DocumentType = z.infer<typeof Document>;
