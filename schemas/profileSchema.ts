import { z } from "zod";

export const Profile = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(24, "Username must be at most 24 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  image: z
    .string()
    .url("Image must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export type Profile = z.infer<typeof Profile>;