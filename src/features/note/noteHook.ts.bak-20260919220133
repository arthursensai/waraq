import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNote,
  deleteNote,
  fetchNote,
  fetchNotes,
  updateNote,
} from "./noteApi";
import { toast } from "sonner";
import { NoteSchemaType, NoteUpdateSchemaType } from "./noteSchema";
import { useRouter } from "next/navigation";

export const useFetchNotes = () => {
  return useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });
};

export const useFetchNote = (id: string) => {
  return useQuery({
    queryKey: ["notes", id],
    queryFn: async () => fetchNote(id),
  });
};

export const useCreateNote = () => {
  const toastId = "create-note";
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: NoteSchemaType) => createNote(note),
    onMutate: () => {
      toast.loading("Saving your note...", { id: toastId });
    },
    onError: () => {
      toast.error("Error saving your note", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Your note was saved!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/dashboard/notes");
    },
  });
};

export const useUpdateNote = () => {
  const toastId = "update-note";
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: NoteUpdateSchemaType) => updateNote(note),
    onMutate: () => {
      toast.loading("Updating your note...", { id: toastId });
    },
    onError: () => {
      toast.error("Error updating your note", { id: toastId });
    },
    onSuccess: (data) => {
      toast.success("Your note was updated!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", data.id] });
    },
  });
};

export const useDeleteNote = () => {
  const toastId = "delete-note";
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => deleteNote(id),
    onMutate: () => {
      toast.loading("Deleting your note...", { id: toastId });
    },
    onError: () => {
      toast.error("Error deleting your note", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Note deleted", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/dashboard/notes");
    },
  });
};
