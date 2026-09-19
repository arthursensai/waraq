import { test, expect } from "@playwright/test";
import { hasTestUser } from "./helpers";

test.skip(
  !hasTestUser,
  "Requires E2E_TEST_USER_EMAIL/E2E_TEST_USER_PASSWORD for a dedicated test Supabase project. See tests/e2e/README.md.",
);

test("a logged-in user can update their username from the profile page", async ({
  page,
}) => {
  const newUsername = `e2e_user_${Date.now()}`.slice(0, 24);

  await page.goto("/dashboard/profile");

  const usernameInput = page.locator("#username");
  await usernameInput.fill(newUsername);
  await page.getByRole("button", { name: /update profile/i }).click();

  // Re-visiting confirms the change was actually persisted, not just
  // reflected optimistically in local component state.
  await page.reload();
  await expect(page.locator("#username")).toHaveValue(newUsername);
});
