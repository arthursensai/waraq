import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createDocument,
  fetchDocument,
  fetchDocuments,
  uploadFile,
} from "./documentApi";
import { toast } from "sonner";
import { DocumentSchemaType } from "./documentSchema";
import { useRouter } from "next/navigation";

export const useFetchDocuments = () => {
  return useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
  });
};

export const useFetchDocument = (id: string) => {
  return useQuery({
    queryKey: ["documents", id],
    queryFn: async () => {
      return fetchDocument(id);
    },
  });
};

export const useFileUpload = () => {
  const toastId = "document-file-upload";
  return useMutation({
    mutationFn: async (fileDocument: File) => {
      return uploadFile(fileDocument);
    },
    onMutate: () => {
      toast.loading("Uploading your file...", { id: toastId });
    },
    onError: () => {
      toast.error("Error uploading your file", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Your file was successfully uploaded!", { id: toastId });
    },
  });
};

export const useCreateDocument = () => {
  const toastId = "create-document";

  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      document,
      imageId,
    }: {
      document: DocumentSchemaType;
      imageId: string;
    }) => {
      return createDocument({ document, imageId });
    },
    onMutate: () => {
      toast.loading("Creating your document...", { id: toastId });
    },
    onError: () => {
      toast.error("error creating your document", { id: toastId });
    },
    onSuccess: () => {
      toast.success("your document was successfully created!", { id: toastId });
      router.push("/dashboard/documents");
    },
  });
};

export const useUpdateDocument = () => {};
