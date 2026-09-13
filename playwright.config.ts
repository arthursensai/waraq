import { defineConfig, devices } from "@playwright/test";

/**
 * Waraq E2E tests run against a real (built) Next.js app.
 *
 * Two kinds of specs exist here, see tests/e2e/README.md for the full
 * explanation:
 *  - Unauthenticated specs (redirect checks, client-side form validation)
 *    run against any environment with zero configuration.
 *  - Authenticated specs (create a note/author, edit profile) need a
 *    dedicated *test* Supabase project and a seeded test user, provided via
 *    env vars. They skip themselves automatically when those env vars are
 *    absent, so `npm run test:e2e` is never blocked on secrets existing.
 */

const PORT = process.env.PLAYWRIGHT_PORT ?? "3100";
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  timeout: 30_000,

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tests/e2e/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],

  // Reuses a dev server you already have running locally (set
  // PLAYWRIGHT_SKIP_WEBSERVER=1), otherwise builds+starts one for CI so
  // the tests run against production-like output.
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: `npm run build && npm run start -- -p ${PORT}`,
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
