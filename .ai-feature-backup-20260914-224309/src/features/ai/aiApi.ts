import { createClient } from "@/lib/supabase/client";

export type ChatMessageRow = {
  id: string;
  role: "user" | "ai";
  content: string;
  created_at: string;
};

export const fetchChatHistory = async (
  documentId: string,
): Promise<ChatMessageRow[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ai_chat_messages")
    .select("id, role, content, created_at")
    .eq("document_id", documentId)
    .order("created_at", { ascending: true });

  if (error) throw new Error("Error fetching chat history");

  return data;
};

export const clearChatHistory = async (documentId: string) => {
  const supabase = createClient();

  const { error } = await supabase
    .from("ai_chat_messages")
    .delete()
    .eq("document_id", documentId);

  if (error) throw new Error("Error clearing chat history");

  return documentId;
};

export const askAi = async ({
  documentId,
  question,
}: {
  documentId: string;
  question: string;
}) => {
  const supabase = createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    throw new Error("No user session found");
  }

  const res = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ documentId, question }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "AI request failed");
  }

  return data.answer as string;
};
