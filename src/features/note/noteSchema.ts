import { z } from "zod";

export const NoteSchema = z.object({
  id: z.uuid(),

  document_id: z.uuid("Please select a valid document").nullable().optional(),

  title: z
    .string()
    .max(100, "Title must be at most 100 characters.")
    .optional(),

  content: z
    .string("Note content is required")
    .min(3, "Note must be at least 3 characters.")
    .max(2000, "Note must be at most 2000 characters."),
});

export const NoteUpdateSchema = NoteSchema.partial();

export type NoteSchemaType = z.infer<typeof NoteSchema>;
export type NoteUpdateSchemaType = z.infer<typeof NoteUpdateSchema>;
