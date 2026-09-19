import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  askAi,
  clearChatHistory,
  fetchChatHistory,
  fetchDocumentRagStatus,
} from "./aiApi";

export const useChatHistory = (documentId: string) => {
  return useQuery({
    queryKey: ["ai-chat", documentId],
    queryFn: () => fetchChatHistory(documentId),
    enabled: !!documentId,
  });
};

export const useDocumentRagStatus = (documentId: string) => {
  return useQuery({
    queryKey: ["ai-chat-rag-status", documentId],
    queryFn: () => fetchDocumentRagStatus(documentId),
    enabled: !!documentId,
    // Indexing runs in the background (pg_cron, ~1/min); poll gently while
    // it's not done yet so the banner clears on its own.
    refetchInterval: (query) =>
      query.state.data === "pending" || query.state.data === "processing"
        ? 15_000
        : false,
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
