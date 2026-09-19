import { test as setup, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const authFile = path.join(__dirname, ".auth/user.json");

const TEST_EMAIL = process.env.E2E_TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.E2E_TEST_USER_PASSWORD;

setup("authenticate", async ({ page }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  if (!TEST_EMAIL || !TEST_PASSWORD) {
    // No dedicated test-user credentials configured (e.g. a contributor's
    // machine, or a CI run that intentionally only checks the
    // unauthenticated specs). Write an empty, logged-out storage state so
    // the "chromium" project can still start - authenticated specs detect
    // the missing env vars themselves and skip.
    fs.writeFileSync(authFile, JSON.stringify({ cookies: [], origins: [] }));
    return;
  }

  await page.goto("/auth/login");
  await page.getByPlaceholder("m@example.com").fill(TEST_EMAIL);
  await page.locator('input[name="password"]').fill(TEST_PASSWORD);
  await page.getByRole("button", { name: /login/i }).click();

  // A successful login redirects away from /auth/login, either to
  // /dashboard or /onboarding for a brand-new test user.
  await expect(page).not.toHaveURL(/\/auth\/login/, { timeout: 15_000 });

  await page.context().storageState({ path: authFile });
});
