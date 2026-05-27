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
  - `(routes)/` — page routes (`about/`, `contact/`)
  - `components/layout/` — Header, Footer (each with SCSS module + `index.tsx`)
  - `components/ui/` — shared UI primitives
  - `globals.css`, `layout.tsx`, `page.tsx` (home)
- `src/app/(payload)/` — Payload-owned routes. **Auto-generated, do not edit by hand**. Only safe to edit: `custom.scss`.

Make CMS changes via `payload.config.ts`, then regenerate types.

### Payload config

`payload.config.ts` is the single source of truth for collections, globals, and DB.

- DB: Postgres via `@payloadcms/db-postgres`, connection from `SUPABASE_URI`.
- Storage: S3 via `@payloadcms/storage-s3` for media uploads.
- Editor: Lexical (`@payloadcms/richtext-lexical`).
- Collections: `Works` (title, description, category, active, two media upload fields) and `Media` (upload + altText).
- TS path aliases: `@/*` → `src/`, `@payload-config` → `./payload.config.ts`.

Required env vars (`.env.local`): `PAYLOAD_SECRET`, `SUPABASE_URI`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION`, `S3_ENDPOINT`.

### Generated files (never edit by hand)

- `payload-types.ts` — regenerated from collections via `payload generate:types`
- `src/app/(payload)/**` — Payload scaffolding

## Next.js version caveat

This is Next.js 16 + React 19. APIs, conventions, and file structure may differ from training data. Read guides in `node_modules/next/dist/docs/` before writing code.
