import { z } from "zod";

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/constants/files";

export const ProfileSchema = z.object({
  id: z.uuid(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(24, "Username must be at most 24 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),

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

export type ProfileType = z.infer<typeof ProfileSchema>;
