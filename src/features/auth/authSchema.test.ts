import { describe, expect, it } from "vitest";
import { LoginSchema, SignUpSchema } from "./authSchema";

describe("LoginSchema", () => {
  it("accepts a valid email and an 8+ character password", () => {
    const result = LoginSchema.safeParse({
      email: "reader@waraq.app",
      password: "verysecure123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid email address", () => {
    const result = LoginSchema.safeParse({
      email: "not-an-email",
      password: "verysecure123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = LoginSchema.safeParse({
      email: "reader@waraq.app",
      password: "short",
    });

    expect(result.success).toBe(false);
  });
});

describe("SignUpSchema", () => {
  it("accepts matching passwords", () => {
    const result = SignUpSchema.safeParse({
      email: "reader@waraq.app",
      password: "verysecure123",
      confirmPassword: "verysecure123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects mismatched password confirmation and flags the right field", () => {
    const result = SignUpSchema.safeParse({
      email: "reader@waraq.app",
      password: "verysecure123",
      confirmPassword: "somethingElse123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("confirmPassword");
    }
  });
});
