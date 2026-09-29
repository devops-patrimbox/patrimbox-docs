# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The PatrimBox help center (end-user documentation, **written in French**), built with Nextra 4 (`nextra-theme-docs`) on the Next.js 16 App Router, React 19. Almost all work here is content editing in MDX; there is very little application code.

## Commands

Package manager is **pnpm** (pinned via `packageManager`).

```bash
pnpm install
pnpm dev            # dev server on http://localhost:3000 (.claude/launch.json uses port 3210)
pnpm build          # next build, then Pagefind indexes .next/server/app into public/_pagefind
pnpm start          # serve the production build
pnpm check-types    # tsc --noEmit
```

There are no tests and no linter configured. The dev server needs the Supabase project to be reachable, or every page redirects to `/login` and login fails. `pnpm check-types` plus `pnpm build` is the verification path.

Search only works after `pnpm build`: in `pnpm dev` the Pagefind index (`public/_pagefind`, gitignored) is missing unless a previous build generated it. Indexing is now part of the `build` script itself; the README still describes it as a `postbuild` step, which is out of date.

## Architecture

- **Content = filesystem routes.** Each page is `app/<section>/<slug>/page.mdx` with `title` frontmatter. A section's `index` page is its `app/<section>/page.mdx`.
- **Sidebar order and labels come from `_meta.js` files**, one per directory. A new page doesn't appear in the intended place until its slug is added to the parent `_meta.js`. The root `app/_meta.js` defines the top-level sections and hides the home page (`index`) chrome (no sidebar/TOC/breadcrumb).
- **`app/layout.tsx`** is the single place where the Nextra `Layout` is configured: navbar/logo, footer, French UI strings (theme switch, TOC labels), `editLink`/`feedback` disabled, and sidebar collapse level. `getPageMap()` builds navigation from the `app/` tree and `_meta.js` files.
- **`app/search-client.tsx`** renders Nextra's `<Search>` only on the client after mount. This is a deliberate workaround for a hydration mismatch (headlessui `useId()` vs. next-themes); don't replace it with the server-rendered default `search` prop.
- **`mdx-components.js`** just merges the theme's MDX components; custom MDX components would be registered there.
- **Branding** lives in `app/globals.css`: primary color `#5474B4`, set through Nextra's `--nextra-primary-*` HSL variables (with a lighter lightness under `.dark`), the Roboto font via `--font-body`, and light/dark logo swapping (`.logo-light` / `.logo-dark`, assets in `public/brand/`).

## Authentication

The whole site sits behind a login against the **same Supabase project as `../patrimbox-app`**: same accounts, and `.env.local` needs that project's `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`).

- `proxy.ts` (Next 16's renamed middleware, at the repo root since there is no `src/`) refreshes the Supabase session with `getUser()` and redirects any request without one to `/login?next=…`. That includes `/_pagefind`, which holds the full text. Only `_next/static`, `_next/image`, the icons and `public/brand/` are excluded by the matcher. New public assets needed by the login page must be added there.
- `lib/auth/actions.ts` holds the `login` (`signInWithPassword`) and `logout` server actions. `lib/supabase/` mirrors the app's server client and its cookie hardening (`httpOnly`, `sameSite: lax`).
- `/login` is `app/login/page.tsx`. It can't escape the Nextra `Layout`: Nextra doesn't normalize `_meta.js` keys inside route groups, so a separate root layout would break the sidebar. The page is hidden via `app/_meta.js` instead, and `SearchClient`/`LogoutButton` render nothing on `/login`.
- After login, users go back to the page they were bounced from (`next` param, checked by `lib/auth/redirect.ts`), or to `/`.
- This is password-only: unlike the app, there is no MFA, no Payload login and no check of the `users`/`admins` collections. Any Supabase Auth account gets in.

## Content conventions

- Write in French, using typographic apostrophes (`’`) and French quotes (`« … »`), matching existing pages.
- Components are imported per page from `nextra/components`: mainly `Callout`, `Steps`, `Cards`/`Cards.Card`, and occasionally `Tabs`.
- Sections: `premiers-pas`, `espace-client` (end clients), `espace-professionnel` (notaries, lawyers, real-estate agents, brokers), `abonnement`, `compte`, `aide`.

## Gotcha

`zod` is pinned to `4.3.6` through `pnpm.overrides`. `zod` 4.4.x breaks prop validation for `nextra-theme-docs@4.6`'s `Layout`. Don't remove the override when upgrading dependencies unless Nextra has fixed this.
