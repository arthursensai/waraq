import * as z from "zod";

export const Pdf = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title must be at most 100 characters."),
  
  author: z.string()
    .min(3, "Author name must be at least 3 characters.") 
    .max(50, "Author name must be at most 50 characters."),

  description: z.string()
    .min(12, "Description must be at least 12 characters.")
    .max(500, "Description must be at most 500 characters.")
});


export type Pdf = z.infer<typeof Pdf>;