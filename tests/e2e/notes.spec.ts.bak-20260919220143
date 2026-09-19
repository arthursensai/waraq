import { test, expect } from "@playwright/test";
import { hasTestUser } from "./helpers";

test.skip(
  !hasTestUser,
  "Requires E2E_TEST_USER_EMAIL/E2E_TEST_USER_PASSWORD for a dedicated test Supabase project. See tests/e2e/README.md.",
);

test("a logged-in user can create a note and see it in their notes list", async ({
  page,
}) => {
  const noteContent = `E2E note ${Date.now()}`;

  await page.goto("/dashboard/notes/new");
  await page
    .getByPlaceholder(/capture your thought/i)
    .fill(noteContent);

  const saveButton = page.getByRole("button", { name: /save note/i });
  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  await expect(page).toHaveURL(/\/dashboard\/notes/);
  await expect(page.getByText(noteContent)).toBeVisible();
});

test("the Save button stays disabled for a near-empty note", async ({
  page,
}) => {
  await page.goto("/dashboard/notes/new");
  await page.getByPlaceholder(/capture your thought/i).fill("hi");

  await expect(page.getByRole("button", { name: /save note/i })).toBeDisabled();
});
