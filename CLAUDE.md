# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"رامية نيوز" (Ramia News) — an Arabic-language (RTL) news site built with Next.js 15 (App Router, Turbopack) and React 19. The public site currently renders from static mock data; a Supabase backend and admin CMS exist in the codebase but are not yet wired into the public pages (see Architecture below).

## Commands

```bash
npm run dev      # start dev server (Turbopack), http://localhost:3000
npm run build    # production build (Turbopack)
npm run start    # run production build
npm run lint     # eslint
```

There is no test suite configured in this repo.

## Architecture

### Public site is mock-data driven, not database driven

All public pages (`src/app/page.tsx`, `src/app/[category]/page.tsx`, `src/app/article/[id]/page.tsx`) currently read from `src/lib/mock-data.ts`, not from Supabase. `src/lib/supabase/queries.ts` contains fully-written read helpers (`getFeaturedArticles`, `getCategoryArticles`, `getMostRead`, `getArticleBySlug`, etc.) that mirror the same shape but are **not yet called from any page**. When asked to "connect the frontend to the database," the task is to swap mock-data calls in page components for the corresponding functions in `src/lib/supabase/queries.ts` — the query logic itself already exists and shouldn't need to be rewritten.

`src/lib/mock-data.ts` also has an ID-based routing quirk: `getCategoryPage()` synthesizes extra fake articles by cycling through a small pool and suffixing ids (`${base.id}-${cycle}`), and `findArticleById()` strips a trailing `-\d+` to resolve those synthesized ids back to the original mock article. This only matters for the mock-data path — real Supabase-backed articles will use their actual `slug`/`id`.

### Supabase project is not provisioned yet

`src/lib/supabase/is-configured.ts` (`isSupabaseConfigured()`) gates all Supabase-dependent behavior on whether `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set. Until a real project exists:
- `src/middleware.ts` → `src/lib/supabase/middleware.ts` (`updateSession`) no-ops instead of crashing.
- The admin dashboard layout (`src/app/admin/(dashboard)/layout.tsx`) shows a "Supabase not configured" screen instead of hitting the DB.
- `src/types/database.ts` is **hand-written** to match `supabase/migrations/0001_init.sql` (there is no live project to generate types from yet). Once a project exists, regenerate with `npx supabase gen types typescript --project-id <id> > src/types/database.ts` and keep it in sync with migrations manually until then.

### Auth / admin CMS

- Auth is Supabase Auth (email/password) via `@supabase/ssr`. `src/lib/supabase/server.ts` creates the server client (Server Components/Actions); `src/lib/supabase/client.ts` creates the browser client.
- Admin routes live under `src/app/admin/`. `src/app/admin/(dashboard)/layout.tsx` enforces both "logged in" AND `profiles.is_admin = true` (a plain authenticated Supabase user is not enough — the `profiles` row needs `is_admin`). `src/middleware.ts` only handles the redirect-to-login half of this; the `is_admin` check happens in the layout itself.
- Article CRUD (`src/app/admin/(dashboard)/articles/actions.ts`) uses Next.js Server Actions (`"use server"`) with `useActionState`-style `(prevState, formData)` signatures, not API routes.
- DB access control is enforced via Postgres RLS policies defined in `supabase/migrations/0001_init.sql` (e.g. `articles_select_published_or_admin`, `articles_write_admin`) — write paths rely on RLS rather than app-level role checks, so schema/policy changes belong in a new migration file, not just in `src/types/database.ts`.

### Contact form

`src/app/api/contact/route.ts` is a standalone API route sending mail via `nodemailer` (Gmail SMTP, `EMAIL_USER`/`EMAIL_PASS`/`RECEIVER_EMAIL` env vars) — unrelated to Supabase and to the "portfolio contact form" wording in its own copy (leftover from a template).

### UI conventions

- shadcn/ui components (`src/components/ui/*`) — style `new-york`, base color `neutral`, icon library `lucide-react`. Config in `components.json`. Add new primitives via the shadcn CLI conventions already reflected in `components.json` aliases (`@/components`, `@/lib/utils`, etc.) rather than hand-rolling equivalents.
- Layout is RTL Arabic content throughout; watch for logical-property classes (`start-*`, `ps-*`, etc.) rather than `left`/`right` when adding UI.
- `next.config.ts` allows all `https` remote image hosts (`hostname: "**"`) because article images are admin-entered URLs, not user-submitted — this is intentional, not an oversight.

### Env vars

See `.env.example`. `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe for client use. `SUPABASE_SERVICE_ROLE_KEY` is commented out and unused — it must never be prefixed with `NEXT_PUBLIC_` or referenced from client components since it bypasses RLS; only add it if a specific server-only feature needs it.
