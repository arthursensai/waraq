import { z } from "zod";

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/constants/files";

export const AuthorSchema = z.object({
  id: z.uuid(),
  full_name: z
    .string()
    .min(3, "author full name must be at least 3 characters")
    .max(30, "author full name must be at most 24 characters"),
  biography: z
    .string()
    .min(10, "Biography must be at least 10 characters")
    .max(500, "Biography must be at most 1000 characters"),

  image_file: z
    .instanceof(File)
    .refine((f) => f.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
    .refine(
      (f) => ACCEPTED_IMAGE_TYPES.includes(f.type as any),
      "Only JPEG, PNG, WebP, GIF and SVG files are accepted.",
    )
    .nullable(),
  image_id: z.uuid(),
});
export const UpdateAuthorSchema = AuthorSchema.partial();

export type AuthorSchemaType = z.infer<typeof AuthorSchema>;
export type UpdateAuthorSchemaType = z.infer<typeof AuthorSchema>;
