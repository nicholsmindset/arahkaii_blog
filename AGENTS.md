# Repository Guidelines

## Project Structure & Module Organization

This is an Astro 6 editorial publication. Routes live in `src/pages/`; shared chrome and article shells are in `src/layouts/`; reusable UI belongs in `src/components/`. Published and draft articles are Markdown/MDX files under `src/content/posts/<year>/`, while author records live in `src/content/authors/`. Keep images in `src/assets/images/<slug>/`; archived WordPress media remains under `src/assets/images/archive/`. Editorial policy, voice, SEO fields, and image rules are documented in `references/`. Read `CLAUDE.md` before changing design or content.

## Build, Test, and Development Commands

- `npm ci` — install the locked dependency set.
- `npm run dev` — start Astro locally at `http://localhost:4321`.
- `npm run check` — run Astro and TypeScript diagnostics.
- `npm run build` — create the Netlify production bundle in `dist/`.
- `npm run verify` — run the complete release gate: diagnostics, build, JSON-LD, links, and page semantics.
- `npm run preview` — inspect the production build locally.

## Coding Style & Naming Conventions

Use tabs in Astro, TypeScript, JavaScript, and CSS where the surrounding file does. Follow the existing Prettier-compatible formatting and strict TypeScript settings. Components and layouts use `PascalCase`; scripts, routes, and article slugs use `kebab-case`. Reuse tokens and primitives from `src/styles/` rather than introducing new colours, fonts, shadows, or button styles. Editorial copy uses British English and sentence-case headlines.

## Content & Testing Guidelines

Every article must satisfy `src/content.config.ts`, including credited hero imagery and one of the eight established categories. Preserve WordPress URLs with `legacyWpSlug`. Never publish sourced imagery without recorded approval and licensing. There is no unit-test suite; run `npm run verify` and perform focused browser checks at mobile and desktop widths.

## Commit & Pull Request Guidelines

Use Conventional Commits, such as `fix(home): remove horizontal overflow` or `feat(newsletter): connect MailerLite capture`. Keep commits scoped and do not commit secrets or `.env`. Pull requests should explain the editorial or technical intent, list verification performed, link relevant issues, and include screenshots for visual changes. Routine publishing is reviewed through a PR before merging to `main`.
