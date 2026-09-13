import { test, expect } from "@playwright/test";
import { hasTestUser } from "./helpers";

test.skip(
  !hasTestUser,
  "Requires E2E_TEST_USER_EMAIL/E2E_TEST_USER_PASSWORD for a dedicated test Supabase project. See tests/e2e/README.md.",
);

test("a logged-in user can create an author and then delete it", async ({
  page,
}) => {
  const authorName = `E2E Author ${Date.now()}`;

  await page.goto("/dashboard/authors/new");
  await page.getByPlaceholder(/jane austen/i).fill(authorName);
  await page
    .getByPlaceholder(/write a short bio/i)
    .fill("A biography written entirely by an end-to-end test.");
  await page.getByRole("button", { name: /save author/i }).click();

  await expect(page).toHaveURL(/\/dashboard\/authors/);
  await expect(page.getByText(authorName)).toBeVisible();

  // Clean up so repeated runs don't pile up test data in the test project.
  await page.getByText(authorName).click();
  await page.getByRole("button", { name: /delete/i }).click();
  await page.getByRole("button", { name: /confirm/i }).click();
  await expect(page.getByText(authorName)).not.toBeVisible();
});

test("shows a validation error for a biography that's too short", async ({
  page,
}) => {
  await page.goto("/dashboard/authors/new");
  await page.getByPlaceholder(/jane austen/i).fill("A Test Author");
  await page.getByPlaceholder(/write a short bio/i).fill("too short");
  await page.getByPlaceholder(/write a short bio/i).blur();

  await expect(page.getByText(/at least 10 characters/i)).toBeVisible();
});
