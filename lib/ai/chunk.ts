export type TextChunk = {
  content: string;
  pageNumber: number;
};

// Character-based chunking (no tokenizer dependency needed). ~1200 chars is
// roughly 200-300 tokens for most languages, which keeps each chunk focused
// enough for accurate retrieval while staying cheap to embed.
const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 150;

/**
 * Splits a single page's text into overlapping chunks. Overlap keeps a
 * sentence that straddles a chunk boundary readable in at least one chunk.
 */
export const chunkPageText = (
  text: string,
  pageNumber: number,
): TextChunk[] => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];

  if (clean.length <= CHUNK_SIZE) {
    return [{ content: clean, pageNumber }];
  }

  const chunks: TextChunk[] = [];
  let start = 0;

  while (start < clean.length) {
    const end = Math.min(start + CHUNK_SIZE, clean.length);
    chunks.push({ content: clean.slice(start, end), pageNumber });
    if (end === clean.length) break;
    start = end - CHUNK_OVERLAP;
  }

  return chunks;
};
