# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager: **pnpm** (lockfile: `pnpm-lock.yaml`).

- `pnpm dev` — Next.js dev server (http://localhost:3000, Payload admin at `/admin`)
- `pnpm build` — production build
- `pnpm start` — serve built app
- `pnpm lint` — ESLint (flat config, extends `eslint-config-next` core-web-vitals + typescript)
- `pnpm dlx payload generate:types` — regenerate `payload-types.ts` after editing collections in `payload.config.ts`
- `pnpm dlx payload generate:importmap` — regenerate `app/(payload)/admin/importMap.js` after adding custom admin components

No test runner configured.

## Architecture

Next.js 16 App Router + Payload CMS 3 in a **single Next app**. Payload is mounted into the same Next process via `withPayload` in `next.config.ts` — no separate CMS server.

### Route group split

`src/app/` uses two route groups:

- `src/app/(app)/` — public site (frontend):
  - `(routes)/` — page routes: `(home)/` (route group), `about/`, `contact/`
  - `components/layout/` — Header, Footer (each with SCSS module + `index.tsx`)
  - `components/ui/`, `components/hooks/` — shared UI primitives + hooks
  - `globals.css`, `layout.tsx`
- `src/app/(payload)/` — Payload-owned routes. **Auto-generated, do not edit by hand**. Only safe to edit: `custom.scss`.

**Route file pattern**: each route dir has `page.tsx` (server: fetches via `src/services/`, sets `revalidate`) + `index.tsx` (the client/body component it renders).

Make CMS changes via `src/payload.config.ts` + `src/collections/` / `src/globals/`, then regenerate types.

### Payload config

`src/payload.config.ts` wires DB, storage, and imports collections/globals from sibling dirs.

- DB: Postgres via `@payloadcms/db-postgres`, connection from `SUPABASE_URI`.
- Storage: S3 via `@payloadcms/storage-s3` for media uploads.
- Editor: Lexical (`@payloadcms/richtext-lexical`).
- Collections (`src/collections/`): `Works` (title, description, year, category, medium, active, media upload fields incl. video) and `Media` (upload + altText).
- Globals (`src/globals/`): `About`, `Contact`.
- Data fetching: `src/services/` (works, about, contact, media) wrap `getPayload`; called from route `page.tsx`. Don't call Payload directly in components.
- TS path aliases: `@/*` → `src/`, `@app/*` → `src/app/(app)/`, `@payload-config` → `./src/payload.config.ts`.

Required env vars (`.env.local`): `PAYLOAD_SECRET`, `SUPABASE_URI`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION`, `S3_ENDPOINT`.

### Generated files (never edit by hand)

- `payload-types.ts` — regenerated from collections via `payload generate:types`
- `src/app/(payload)/**` — Payload scaffolding

## Next.js version caveat

This is Next.js 16 + React 19. APIs, conventions, and file structure may differ from training data. Read guides in `node_modules/next/dist/docs/` before writing code.
