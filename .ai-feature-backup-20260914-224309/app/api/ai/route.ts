import { NextResponse } from "next/server";
import { checkAuth } from "@/handlers/checkAuth";
import { generateAiResponse } from "@/lib/ai";

const MAX_QUESTION_LENGTH = 1000;

export const POST = checkAuth(async ({ req, supabase, user }) => {
  const body = await req.json().catch(() => null);
  const documentId = body?.documentId as string | undefined;
  const question = (body?.question as string | undefined)?.trim();

  if (!documentId || !question) {
    return NextResponse.json(
      { error: "documentId and question are required" },
      { status: 400 },
    );
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json(
      { error: `Question must be at most ${MAX_QUESTION_LENGTH} characters.` },
      { status: 400 },
    );
  }

  // Going through the user's own Supabase client (not a service-role
  // client) means RLS still applies here — a user can only ask about
  // documents they're actually allowed to read.
  const { data: document, error } = await supabase
    .from("documents_view")
    .select("title, description, author_name, content_type, content_language")
    .eq("id", documentId)
    .single();

  if (error || !document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const prompt = `You are a helpful reading assistant inside "Waraq", a document/book library app.
A user is currently reading the following document:

Title: ${document.title}
Author: ${document.author_name}
Description: ${document.description}
Type: ${document.content_type}
Language: ${document.content_language}

Answer the user's question below. Keep the answer concise and relevant to the document above.
If the question can't be answered from the information you have about this document, say so honestly instead of making something up.

User's question: ${question}`;

  try {
    const answer = await generateAiResponse(prompt);

    // Persist the exchange so it survives navigation/reloads. This runs
    // through the user's own client, so RLS still requires user_id to
    // match auth.uid(). A history-save failure shouldn't fail the request
    // the user is waiting on, so we only log it.
    const { error: historyError } = await supabase
      .from("ai_chat_messages")
      .insert([
        { user_id: user.id, document_id: documentId, role: "user", content: question },
        { user_id: user.id, document_id: documentId, role: "ai", content: answer },
      ]);

    if (historyError) {
      console.error("Failed to save AI chat history:", historyError);
    }

    return NextResponse.json({ answer }, { status: 200 });
  } catch (err) {
    console.error("AI request failed:", err);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
});
