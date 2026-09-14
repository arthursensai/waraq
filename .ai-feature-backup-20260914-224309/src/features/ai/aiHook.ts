import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { askAi, clearChatHistory, fetchChatHistory } from "./aiApi";

export const useChatHistory = (documentId: string) => {
  return useQuery({
    queryKey: ["ai-chat", documentId],
    queryFn: () => fetchChatHistory(documentId),
    enabled: !!documentId,
  });
};

export const useAskAi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      documentId,
      question,
    }: {
      documentId: string;
      question: string;
    }) => {
      return askAi({ documentId, question });
    },
    onError: () => {
      toast.error("The AI couldn't answer that. Please try again.");
    },
    onSuccess: (_answer, { documentId }) => {
      // The question/answer pair is persisted server-side; refetch so the
      // history reflects what's actually stored.
      queryClient.invalidateQueries({ queryKey: ["ai-chat", documentId] });
    },
  });
};

export const useClearChatHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => clearChatHistory(documentId),
    onSuccess: (documentId) => {
      queryClient.setQueryData(["ai-chat", documentId], []);
      toast.success("Chat history cleared");
    },
    onError: () => {
      toast.error("Couldn't clear the chat history");
    },
  });
};
