import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import MuPDF from "mupdf";
import { chunkPageText } from "@/lib/ai/chunk";
import { embedTexts } from "@/lib/ai/embeddings";

// How much work one invocation does. Kept small so a single run comfortably
// fits inside a serverless function's time budget regardless of document
// size — pg_cron just calls this again a minute later to continue where the
// previous run left off.
const PAGES_PER_RUN = 20;
const DOCUMENTS_PER_RUN = 3;

type PendingDocument = {
  id: string;
  user_id: string;
  total_pages: number;
  rag_progress_page: number;
  files: { url: string } | null;
};

type AdminClient = ReturnType<typeof createAdminClient>;

const processDocumentBatch = async (supabase: AdminClient, doc: PendingDocument) => {
  if (!doc.files?.url) {
    throw new Error("Document has no associated file");
  }

  if (doc.rag_progress_page === 0) {
    await supabase
      .from("documents")
      .update({ rag_status: "processing" })
      .eq("id", doc.id);
  }

  const fileRes = await fetch(doc.files.url);
  if (!fileRes.ok) throw new Error("Failed to download source PDF");
  const buffer = await fileRes.arrayBuffer();

  const pdf = MuPDF.Document.openDocument(buffer, "application/pdf");

  const startPage = doc.rag_progress_page;
  const endPage = Math.min(startPage + PAGES_PER_RUN, doc.total_pages);

  const pageChunks: { content: string; pageNumber: number }[] = [];

  for (let pageIndex = startPage; pageIndex < endPage; pageIndex++) {
    const page = pdf.loadPage(pageIndex);
    const text = page.toStructuredText("preserve-whitespace").asText();
    pageChunks.push(...chunkPageText(text, pageIndex + 1));
    page.destroy();
  }

  pdf.destroy();

  if (pageChunks.length > 0) {
    const embeddings = await embedTexts(pageChunks.map((c) => c.content));

    const rows = pageChunks.map((chunk, i) => ({
      document_id: doc.id,
      user_id: doc.user_id,
      chunk_index: startPage * 1000 + i,
      page_number: chunk.pageNumber,
      content: chunk.content,
      embedding: embeddings[i],
    }));

    const { error: insertError } = await supabase
      .from("document_chunks")
      .insert(rows);

    if (insertError) {
      throw new Error(`Failed to store chunks: ${insertError.message}`);
    }
  }

  const isDone = endPage >= doc.total_pages;

  await supabase
    .from("documents")
    .update({
      rag_progress_page: endPage,
      rag_status: isDone ? "ready" : "processing",
    })
    .eq("id", doc.id);

  return {
    documentId: doc.id,
    pagesProcessed: endPage - startPage,
    status: isDone ? "ready" : "processing",
  };
};

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: pendingDocuments, error } = await supabase
    .from("documents")
    .select("id, user_id, total_pages, rag_progress_page, files(url)")
    .in("rag_status", ["pending", "processing"])
    .limit(DOCUMENTS_PER_RUN);

  if (error) {
    console.error("process-rag: failed to fetch pending documents", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 },
    );
  }

  if (!pendingDocuments || pendingDocuments.length === 0) {
    return NextResponse.json({ message: "Nothing to process" });
  }

  const results = [];

  for (const doc of pendingDocuments as unknown as PendingDocument[]) {
    try {
      results.push(await processDocumentBatch(supabase, doc));
    } catch (err) {
      console.error(`process-rag: failed on document ${doc.id}`, err);
      await supabase
        .from("documents")
        .update({
          rag_status: "failed",
          rag_error: err instanceof Error ? err.message : "Unknown error",
        })
        .eq("id", doc.id);
      results.push({ documentId: doc.id, status: "failed" });
    }
  }

  return NextResponse.json({ processed: results });
}
