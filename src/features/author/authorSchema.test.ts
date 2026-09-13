import { describe, expect, it } from "vitest";
import { CreateAuthorSchema } from "./authorSchema";

const validImageFile = () =>
  new File(["fake-image-bytes"], "cover.png", { type: "image/png" });

describe("CreateAuthorSchema", () => {
  it("accepts a valid author with an image file", () => {
    const result = CreateAuthorSchema.safeParse({
      full_name: "Jane Austen",
      biography: "An English novelist known for her wit and social commentary.",
      image_file: validImageFile(),
    });

    expect(result.success).toBe(true);
  });

  it("accepts a valid author with no image (image_file is nullable)", () => {
    const result = CreateAuthorSchema.safeParse({
      full_name: "Jane Austen",
      biography: "An English novelist known for her wit and social commentary.",
      image_file: null,
    });

    expect(result.success).toBe(true);
  });

  it("rejects a full_name shorter than 3 characters", () => {
    const result = CreateAuthorSchema.safeParse({
      full_name: "JA",
      biography: "An English novelist known for her wit and social commentary.",
      image_file: null,
    });

    expect(result.success).toBe(false);
  });

  it("rejects a biography shorter than 10 characters", () => {
    const result = CreateAuthorSchema.safeParse({
      full_name: "Jane Austen",
      biography: "Too short",
      image_file: null,
    });

    expect(result.success).toBe(false);
  });

  it("rejects an image file with a disallowed mime type", () => {
    const badFile = new File(["exe-bytes"], "malware.exe", {
      type: "application/x-msdownload",
    });

    const result = CreateAuthorSchema.safeParse({
      full_name: "Jane Austen",
      biography: "An English novelist known for her wit and social commentary.",
      image_file: badFile,
    });

    expect(result.success).toBe(false);
  });
});
