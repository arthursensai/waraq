import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAuthor,
  deleteAuthor,
  fetchAuthor,
  fetchAuthors,
  updateAuthor,
} from "./authorApi";
import { AuthorSchema } from "./authorSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useFetchAuthors = () => {
  return useQuery({
    queryKey: ["authors"],
    queryFn: fetchAuthors,
  });
};

export const useFetchAuthor = (id: string) => {
  return useQuery({
    queryKey: ["author", id],
    queryFn: () => {
      return fetchAuthor(id);
    },
  });
};

export const useCreateAuthor = () => {
  const toastId = "create-author";
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ full_name, biography, image_file }: AuthorSchema) => {
      return createAuthor({ full_name, biography, image_file });
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
    mutationFn: async ({ full_name, biography }: AuthorSchema) => {
      return updateAuthor({ id, full_name, biography });
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
