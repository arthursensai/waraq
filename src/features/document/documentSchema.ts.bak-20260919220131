import { z } from "zod";
import {
  ContentLanguage,
  contentLanguagesDict,
  ContentType,
  contentTypesDict,
} from "./constants";

export const DocumentSchema = z.object({
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

  content_language: z.enum(
    Object.keys(contentLanguagesDict) as [
      ContentLanguage,
      ...ContentLanguage[],
    ],
  ),
  content_type: z.enum(
    Object.keys(contentTypesDict) as [ContentType, ...ContentType[]],
  ),

  tags: z.array(z.string()).default([]).optional(),

  total_pages: z
    .number("Total pages must be a number")
    .positive("Total pages must be greater than 0"),

  read_page: z
    .number("Pages read must be a number")
    .min(0, "Pages read cannot be negative"),
});

export const DocumentUpdateSchema = DocumentSchema.partial();

export type DocumentSchemaType = z.infer<typeof DocumentSchema>;
export type DocumentUpdateSchemaType = z.infer<typeof DocumentUpdateSchema>;
