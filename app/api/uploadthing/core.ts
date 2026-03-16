import { createClient, createUserClient } from "@/lib/supabase/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = async (req: Request) => {
  const supabase = await createClient();
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "");

  const {
    data: { user },
    error,
  } = token
    ? await supabase.auth.getUser(token)
    : await supabase.auth.getUser();

  if (error || !user) return null;

  return { id: user.id, email: user.email, accessToken: token };
};

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);

      if (!user || !user.accessToken)
        throw new UploadThingError("Unauthorized");

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { key: file.key, ufsUrl: file.ufsUrl };
    }),
  documentFileUploader: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);

      if (!user || !user.accessToken)
        throw new UploadThingError("Unauthorized");

      return {
        userId: user.id,
        email: user.email,
        accessToken: user.accessToken,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const supabase = createUserClient(metadata.accessToken);
        const { data, error } = await supabase
          .from("files")
          .insert({
            key: file.key,
            url: file.ufsUrl,
          })
          .select()
          .single();

        if (error || !data) {
          throw error ?? new Error("Insert failed");
        }

        return data.id;
      } catch (err) {
        console.error("Failed to insert document file into Supabase", err);
        return { error: "Error" };
      }
    }),
} satisfies FileRouter;

export type ourFileRouter = typeof ourFileRouter;
