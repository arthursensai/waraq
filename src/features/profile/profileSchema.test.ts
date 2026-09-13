import { describe, expect, it } from "vitest";
import { OnBoardingSchema } from "./profileSchema";

const validImageFile = () =>
  new File(["fake-image-bytes"], "avatar.png", { type: "image/png" });

describe("OnBoardingSchema", () => {
  it("accepts a valid username and image file", () => {
    const result = OnBoardingSchema.safeParse({
      username: "book_reader_42",
      image_file: validImageFile(),
    });
    expect(result.success).toBe(true);
  });

  it("rejects a username shorter than 3 characters", () => {
    const result = OnBoardingSchema.safeParse({
      username: "ab",
      image_file: validImageFile(),
    });
    expect(result.success).toBe(false);
  });

  it("rejects a username containing characters outside letters/numbers/underscore", () => {
    const result = OnBoardingSchema.safeParse({
      username: "not a valid name!",
      image_file: validImageFile(),
    });
    expect(result.success).toBe(false);
  });

  it("requires a profile picture during onboarding", () => {
    const result = OnBoardingSchema.safeParse({
      username: "book_reader_42",
      image_file: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an image file larger than 5MB", () => {
    const oversized = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "big.png", {
      type: "image/png",
    });

    const result = OnBoardingSchema.safeParse({
      username: "book_reader_42",
      image_file: oversized,
    });
    expect(result.success).toBe(false);
  });
});
