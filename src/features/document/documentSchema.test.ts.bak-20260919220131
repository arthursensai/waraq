import { describe, expect, it } from "vitest";
import { DocumentSchema, DocumentUpdateSchema } from "./documentSchema";

const baseDocument = {
  id: "b3b8b1c2-8a2e-4c9a-9b0a-1a2b3c4d5e6f",
  title: "The Great Gatsby",
  author_id: "b3b8b1c2-8a2e-4c9a-9b0a-1a2b3c4d5e70",
  file_id: "b3b8b1c2-8a2e-4c9a-9b0a-1a2b3c4d5e71",
  description: "A classic novel about the American dream.",
  content_language: "en" as const,
  content_type: "novel" as const,
  total_pages: 180,
  read_page: 0,
};

describe("DocumentSchema", () => {
  it("accepts a fully valid document", () => {
    const result = DocumentSchema.safeParse(baseDocument);
    expect(result.success).toBe(true);
  });

  it("rejects a title shorter than 3 characters", () => {
    const result = DocumentSchema.safeParse({ ...baseDocument, title: "GG" });
    expect(result.success).toBe(false);
  });

  it("rejects total_pages that isn't positive", () => {
    const result = DocumentSchema.safeParse({
      ...baseDocument,
      total_pages: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a negative read_page", () => {
    const result = DocumentSchema.safeParse({
      ...baseDocument,
      read_page: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unsupported content_type", () => {
    const result = DocumentSchema.safeParse({
      ...baseDocument,
      content_type: "poem",
    });
    expect(result.success).toBe(false);
  });
});

describe("DocumentUpdateSchema", () => {
  it("allows a partial update with only a single valid field", () => {
    const result = DocumentUpdateSchema.safeParse({ read_page: 42 });
    expect(result.success).toBe(true);
  });
});
