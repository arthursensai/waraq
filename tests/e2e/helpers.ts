/**
 * Authenticated E2E specs need a dedicated *test* Supabase project and a
 * seeded test user (never production). When those env vars aren't set -
 * e.g. a contributor running tests locally for the first time - the specs
 * that require a logged-in session skip themselves with a clear message
 * instead of failing on a missing account.
 *
 * See tests/e2e/README.md for how to configure this.
 */
export const hasTestUser = Boolean(
  process.env.E2E_TEST_USER_EMAIL && process.env.E2E_TEST_USER_PASSWORD,
);
