import ai from "./index";

// text-embedding-004 has a generous free-tier quota and 768 dimensions is
// enough for good retrieval quality on a personal library while keeping the
// pgvector index small.
const EMBEDDING_MODEL = "text-embedding-004";
export const EMBEDDING_DIMENSIONS = 768;

// The Gemini embedding API accepts a batch of strings per call; keeping
// batches modest avoids hitting per-request payload/size limits on large
// documents with thousands of chunks.
const BATCH_SIZE = 32;

export const embedTexts = async (texts: string[]): Promise<number[][]> => {
  const results: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    const response = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: batch,
      config: { outputDimensionality: EMBEDDING_DIMENSIONS },
    });

    for (const embedding of response.embeddings ?? []) {
      results.push(embedding.values ?? []);
    }
  }

  return results;
};

export const embedText = async (text: string): Promise<number[]> => {
  const [embedding] = await embedTexts([text]);
  return embedding ?? [];
};
