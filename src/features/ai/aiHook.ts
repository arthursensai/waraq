import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { askAi } from "./aiApi";

export const useAskAi = () => {
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
  });
};
