# E2E tests (Playwright)

## Two tiers of specs

**No setup required** — `tests/e2e/auth.spec.ts`
Redirects for unauthenticated dashboard access, and client-side login
validation. These run against any Waraq deployment out of the box.

**Requires a dedicated test Supabase project** — `notes.spec.ts`,
`authors.spec.ts`, `profile.spec.ts`
These log in as a real user and exercise create/update flows against a
real database, because Waraq's data layer (`src/features/*/*.Api.ts`)
talks to Supabase directly from the client — there's no server-mocking
seam to intercept without rewriting that architecture, which this project
was explicitly asked not to do. If the env vars below aren't set, these
specs **skip themselves** with a clear reason instead of failing.

Waraq's `proxy.ts` (the Next.js middleware) also calls
`supabase.auth.getUser()` on *every* request, including the "no setup
required" specs above — so realistically all E2E tests need
`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` pointed
at *some* reachable Supabase project (test or otherwise) to run at all
locally. Only the authenticated specs additionally need a seeded test user.

## One-time setup

1. Create a **separate Supabase project** for testing (Supabase's free
   tier is enough) — do not point these at your production project.
2. Run your normal schema/migrations against it so the `profiles`,
   `authors`, `documents`, `notes`, `images` tables (and their RLS
   policies) exist.
3. Create one test user in that project (Authentication → Users → Add
   user) and complete onboarding for it once manually, so it already has
   a `profiles` row and isn't stuck on `/onboarding`.
4. Copy `.env.test.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` —
     from the *test* project's API settings (the anon/publishable key is
     safe to use here — it's what ships in the browser bundle anyway).
   - `E2E_TEST_USER_EMAIL` / `E2E_TEST_USER_PASSWORD` — the user from step 3.
5. In CI, add the same four values as **repository secrets** (Settings →
   Secrets and variables → Actions) with the same names used in
   `.github/workflows/ci.yml`.

## Running

```bash
npm run test:e2e       # headless
npm run test:e2e:ui    # interactive UI mode, great for debugging
```

By default Playwright builds and starts the app itself. If you already
have `npm run dev` running locally, skip that with:

```bash
PLAYWRIGHT_SKIP_WEBSERVER=1 PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e
```

## Cleanup

The author/note specs delete what they create so repeated runs don't pile
up rows in the test project. If a run fails mid-test, you may need to
delete leftover `E2E Author …` / `E2E note …` rows manually.
