import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins multiple class strings together", () => {
    expect(cn("flex", "items-center", "gap-2")).toBe("flex items-center gap-2");
  });

  it("drops falsy values from conditional classes", () => {
    const isActive = false;
    expect(cn("btn", isActive && "btn-active", undefined, null)).toBe("btn");
  });

  it("lets a later conflicting Tailwind class win over an earlier one", () => {
    // tailwind-merge should resolve conflicting utilities instead of
    // concatenating both, which is the whole reason cn() exists.
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });
});
