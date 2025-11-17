<!-- GitHub Copilot / AI agent instructions for this repository -->
# Magic Portfolio — AI Agent Guide

This file gives focused, actionable guidance so an AI coding agent can be productive in this Next.js + Once UI repository.

- **Project type & entrypoints**: This is a Next.js (App Router) site using the `app/` directory. Key entry files:
  - `src/app/layout.tsx` — global layout, theme init scripts, background & Providers.
  - `src/app/page.tsx` and route folders (`src/app/work`, `src/app/gallery`) — primary pages.

- **UI / design system**: The project uses `@once-ui-system/core` extensively: styles and tokens are imported in `layout.tsx`. Configuration and theming are driven from `src/resources` (e.g., `style`, `dataStyle`, `icons`). When changing visual defaults, update `src/resources` and `Providers.tsx`.

- **Important conventions**:
  - App router (server components by default). Files using hooks or browser APIs declare `"use client"` (example: `src/components/Providers.tsx`). Only add `use client` when necessary.
  - MDX content is part of pages: `pageExtensions` include `md`/`mdx`. Work projects are written as `.mdx` under `src/app/work/projects`.
  - Static images live under `public/images/...` — update these when changing project thumbnails or OG images.

- **API routes & OG generation**: API endpoints live under `src/app/api/*`.
  - OG image generation and proxying: `src/app/api/og/generate/route.tsx`, `src/app/api/og/fetch/route.ts`, `src/app/api/og/proxy/route.ts` — be careful: these files mix server rendering and image generation logic.

- **Build / dev / formatting commands** (from `package.json`):
  - `npm run dev` — development server (`next dev`).
  - `npm run build` — production build (`next build`).
  - `npm run export` — `next export` (static export).
  - `npm run start` — `next start`.
  - `npm run lint` — runs `next lint`.
  - `npm run biome-write` — runs `@biomejs/biome format --write .` to format code.

- **Next config notes** (`next.config.mjs`):
  - `pageExtensions` includes `ts`, `tsx`, `md`, `mdx` — MDX is first-class.
  - `transpilePackages: ["next-mdx-remote"]` — treat this package as transpiled by Next.
  - Remote images allow Google host as an example; adjust `images.remotePatterns` carefully.

- **Theme & hydration considerations**:
  - `layout.tsx` injects inline scripts to initialize theme and strip extension attributes before hydration. Avoid refactors that change DOM attribute names or behavior without updating these scripts.
  - Theme values are applied as `data-*` attributes on `document.documentElement` and persisted in `localStorage` (keys: `data-theme` and `data-<key>`).

- **Where content/config lives**:
  - `src/resources/*` — central place for `baseURL`, `style`, `dataStyle`, `fonts`, `icons` and other site settings.
  - `src/app/work/projects/*.mdx` — canonical content sources.

- **Patterns to preserve / watch for**:
  - Server components vs client components boundary; introducing client behavior into server components causes hydration issues.
  - Dangerous use of `dangerouslySetInnerHTML` in `layout.tsx` for inline scripts — modify only with caution.
  - Many components import styles from `@once-ui-system/core/css/*` and `src/resources/custom.css`; keep CSS/token imports in `layout.tsx` so styles remain global.

- **Testing & CI**: There are no test scripts in `package.json`. Formatting is handled with `biome`; linting via `next lint`. CI integrations (Vercel) are assumed by the README.

- **Quick examples**
  - Run dev: `npm install && npm run dev`
  - Add a work project: add a `.mdx` into `src/app/work/projects/` following existing authoring in that folder.
  - Change theme defaults: update `src/resources/style.ts` (or `src/resources/index`) and `src/components/Providers.tsx` if provider props must change.

If anything here is unclear or you'd like more detail on a particular area (routing, OG generation, or theme plumbing), tell me which area to expand and I will update this file.
