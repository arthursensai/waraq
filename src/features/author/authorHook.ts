import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAuthor,
  deleteAuthor,
  fetchAllAuthors,
  fetchAuthor,
  fetchAuthors,
  updateAuthor,
  updateAuthorImage,
} from "./authorApi";
import {
  AuthorSchema,
  AuthorSchemaType,
  UpdateAuthorSchemaType,
} from "./authorSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AvalaiblityType } from "@/lib/constants/types";

export const useFetchAllAuthors = () => {
  return useQuery({
    queryKey: [`all-authors`],
    queryFn: fetchAllAuthors
  });
};

export const useFetchAuthors = (type: AvalaiblityType) => {
  return useQuery({
    queryKey: [`${type}-authors`],
    queryFn: () => {
      return fetchAuthors({ type });
    },
  });
};

export const useFetchAuthor = ({
  id,
  type,
}: {
  id: string;
  type: AvalaiblityType;
}) => {
  return useQuery({
    queryKey: ["author", id],
    queryFn: () => {
      return fetchAuthor({ id, type });
    },
  });
};

export const useCreateAuthor = () => {
  const toastId = "create-author";
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (authorSchema: AuthorSchemaType) => {
      return createAuthor(authorSchema);
    },
    onMutate: () => {
      toast.loading("Creating your author...", { id: toastId });
    },

    onError: (mutateIsError) => {
      toast.error("Error creating your author", { id: toastId });
    },

    onSuccess: () => {
      toast.success("Your author was successfully created", { id: toastId });

      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
  });
};

export const useUpdateAuthor = (id: string) => {
  const queryClient = useQueryClient();
  const toastId = "update-author";

  return useMutation({
    mutationFn: async (updatedAuthorData: UpdateAuthorSchemaType) => {
      return await Promise.all([
        updatedAuthorData.image_file
          ? updateAuthorImage({
              imageFile: updatedAuthorData.image_file,
              imageId: updatedAuthorData.image_id,
              authorId: id,
            })
          : null,
        updateAuthor(updatedAuthorData),
      ]);
    },
    onMutate: () => {
      toast.loading("Your author data is currently being updated...", {
        id: toastId,
      });
    },
    onError: (mutateIsError) => {
      toast.error("Error updating your author data", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Your author successfully updated", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["author", id] });
    },
  });
};

export const useDeleteAuthor = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toastId = "delete-author";

  return useMutation({
    mutationFn: () => deleteAuthor(id),
    onMutate: (mutateIsError) => {
      toast.loading("Your author is currently being deleted...", {
        id: toastId,
      });
    },
    onError: () => {
      toast.error("Error deleting your author", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Your author was successfully deleted", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      router.push("/dashboard/authors");
    },
  });
};
