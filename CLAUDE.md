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

`app/` uses two route groups that segregate frontend from CMS:

- `app/(app)/` — public site (frontend). `layout.tsx`, `page.tsx`, `globals.css`.
- `app/(payload)/` — Payload-owned routes. **Auto-generated, do not edit by hand**:
  - `admin/[[...segments]]/page.tsx` — admin UI catch-all
  - `api/[...slug]/route.ts` — REST API
  - `api/graphql/route.ts`, `api/graphql-playground/route.ts`
  - `layout.tsx` — wraps admin in Payload's `RootLayout`
  - `admin/importMap.js` — regenerated via `payload generate:importmap`

Touching files in `(payload)/` other than `custom.scss` will be overwritten. Make CMS changes via `payload.config.ts`.

### Payload config

`payload.config.ts` is the single source of truth for collections, globals, and DB.

- DB: Postgres via `@payloadcms/db-postgres`, connection from `SUPABASE_URI` env var (Supabase-hosted Postgres).
- Editor: Lexical (`@payloadcms/richtext-lexical`).
- Image processing: `sharp`.
- Required env: `PAYLOAD_SECRET`, `SUPABASE_URI` (see `.env.local`).
- TS path aliases: `@/*` → repo root, `@payload-config` → `./payload.config.ts`.
- Collections array currently empty — add new collections here, then regenerate types.

### Generated files

- `payload-types.ts` — generated from collections; never edit by hand.
- `app/(payload)/**` — generated scaffolding; never edit by hand.

## Next.js version caveat

This is Next.js 16 + React 19. This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
