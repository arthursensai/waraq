import ai from "./index";

const EMBEDDING_MODEL = "gemini-embedding-001";
export const EMBEDDING_DIMENSIONS = 768;

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
