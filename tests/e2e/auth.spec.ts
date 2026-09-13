import { test, expect } from "@playwright/test";

// These specs run in the "chromium" project, which loads a storage state
// via the setup project. If no test user is configured that state is a
// logged-out session, which is exactly what these two checks need.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("protected dashboard access", () => {
  test("redirects an unauthenticated visitor from /dashboard to /auth/login", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("redirects an unauthenticated visitor away from a nested dashboard route", async ({
    page,
  }) => {
    await page.goto("/dashboard/notes/new");
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

test.describe("login form validation", () => {
  test("shows an inline error and stays on the page for a too-short password", async ({
    page,
  }) => {
    await page.goto("/auth/login");

    await page.getByPlaceholder("m@example.com").fill("reader@waraq.app");
    await page.locator('input[name="password"]').fill("short");
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page.getByText(/at least 8 characters/i)).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("shows an inline error for an invalid email address", async ({
    page,
  }) => {
    await page.goto("/auth/login");

    await page.getByPlaceholder("m@example.com").fill("not-an-email");
    await page.locator('input[name="password"]').fill("verysecure123");
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page.getByText(/valid email/i)).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
