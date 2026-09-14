import { createClient } from "@/lib/supabase/client";

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
