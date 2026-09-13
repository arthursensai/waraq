import { describe, expect, it } from "vitest";
import { NoteSchema } from "./noteSchema";

const baseNote = {
  id: "b3b8b1c2-8a2e-4c9a-9b0a-1a2b3c4d5e6f",
  content: "A note worth remembering.",
};

describe("NoteSchema", () => {
  it("accepts a valid note with no document attached", () => {
    const result = NoteSchema.safeParse(baseNote);
    expect(result.success).toBe(true);
  });

  it("accepts a valid note attached to a document", () => {
    const result = NoteSchema.safeParse({
      ...baseNote,
      document_id: "b3b8b1c2-8a2e-4c9a-9b0a-1a2b3c4d5e70",
    });
    expect(result.success).toBe(true);
  });

  it("rejects content shorter than 3 characters", () => {
    const result = NoteSchema.safeParse({ ...baseNote, content: "hi" });
    expect(result.success).toBe(false);
  });

  it("rejects content longer than 2000 characters", () => {
    const result = NoteSchema.safeParse({
      ...baseNote,
      content: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects a document_id that isn't a valid UUID", () => {
    const result = NoteSchema.safeParse({
      ...baseNote,
      document_id: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });
});
