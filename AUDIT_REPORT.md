# NameVerse — Site Audit Report

> Read-only audit. No files were modified.
> Generated: 2026-07-17

---

## 1. Rendering strategy

- **Finding:** The name page uses `generateStaticParams` (line 23), `revalidate = 31536000` (365 days, line 16), and `dynamicParams = true` (line 13). There is **no** `export const dynamic = 'force-dynamic'`. Data fetching is via `serverFetchNameDetail()` (external API + ISR cache), not `getStaticProps`/`getServerSideProps` (App Router is used, not Pages Router).
- **File(s):** `src/app/names/[religion]/[slug]/page.jsx:13,16,23`
- **State:** **ISR (Incremental Static Regeneration)** — statically generated (capped at 28 slugs/religion per `generateStaticParams`, line 40), with remaining slugs rendered on-demand and cached for 365 days.
- **Flag:** ⚠️ `revalidate = 31536000` is **365 days**, but the comment on line 15 says "30-day cache". Code and comment disagree. With such a long TTL, content fixes/backend updates will not appear on existing pages for a year unless manually revalidated. Also `generateStaticParams` only pre-renders ~84 pages while the dataset has 40k+ names — the rest rely entirely on on-demand ISR, meaning the **first visit to any non-prerendered name triggers a live API fetch** (cold render latency).

## 2. Database connection setup

- **Finding:** **There is no MongoDB/Mongoose in this repo.** No `lib/mongodb.js`, `lib/db.js`, or any `mongoose.connect()` / `MongoClient` call exists. Data is fetched over **HTTP** from an external backend via native `fetch()` with `next: { revalidate }`.
- **File(s):** `src/lib/api/server-fetch.js` (entire file); connection base at `src/lib/api/server-fetch.js:20`
- **Flag:** None (no DB to mis-manage). Connection reuse is **N/A** — the "backend" is a separate service (`NEXT_PUBLIC_API_BASE`).

## 3. Query count per name page

- **Finding:** For a single name page render, the following network queries run (all to the external API):
  1. `serverFetchNameDetail(religion, slug)` — name detail (line 117) — may make **up to 2 calls** (primary + fallback endpoint) per `src/lib/api/server-fetch.js:240-271`.
  2. `serverFilterKnownSlugs` × 3 — for `similar_sounding_names`, `related_names`, `name_variations` (lines 157-161). Each slug is checked via `serverFetchNameDetail`, run in parallel but **one API call per slug** (capped at 12 names each, line 318).
  3. `serverFetchTrendingNames({ religion, limit: 8 })` (line 173).
- **File(s):** `src/app/names/[religion]/[slug]/page.jsx:117,157-161,173`; `src/lib/api/server-fetch.js:229-324,330-352`
- **Flag:** ⚠️ **Potentially many API calls per first render.** With 12 related + 12 similar + 12 variations = up to ~36 slug-existence checks (each a full name-detail fetch), plus the main detail and trending calls. All are ISR-cached (365d) so repeat visits are cheap, but the **first render** can be 30+ outbound HTTP requests. Recommendation (not applied): a single batched "filter known slugs" endpoint on the backend. Also `serverFetchRelatedNames` / `serverFetchSimilarNames` exist but are **hardcoded to `religion/islamic/1`** and **unused** on this page (`server-fetch.js:361,386`) — dead code.

## 4. Image handling

- **Finding:** `next/image` **is** used (e.g. `src/components/HomePage/LatestArticles.jsx` for blog thumbnails). Config: **`images.unoptimized = true`** (required for Cloudflare Workers — no Next image optimizer), with `remotePatterns` allowing `images.unsplash.com` and `nameverse.vercel.app`. Images are **not** in a database (no DB). Blog images are **local files** under `/public/images/blog/...` (root-relative) and external Unsplash URLs. Name pages render **no images** (`NameDetail.jsx` has no image tags).
- **File(s):** `next.config.mjs:26-43`; `src/components/HomePage/LatestArticles.jsx` (blog images)
- **Flag:** ⚠️ `unoptimized: true` means images are served as-is (larger bytes, no resizing/format conversion). Correct for Cloudflare (no image optimizer), but **no automatic responsive optimization**. No R2/external object storage is configured for images currently.

## 5. Current hosting configuration

- **Finding:** Two deployment configs exist:
  - **`wrangler.jsonc`** — Cloudflare Workers, `main: ".open-next/worker.js"`, `assets: ".open-next/assets"`, name `namesite`, `compatibility_date: 2026-07-15`, `compatibility_flags: ["nodejs_compat"]`. This is the **active** target.
  - **`vercel.json`** — present but **empty** (`{}`), no routing/build config. A `vercel.app` API base is used as the *backend* default, but the frontend deploy target is Cloudflare.
- **File(s):** `wrangler.jsonc` (full), `vercel.json` (`{}`)
- **Flag:** ⚠️ The **API backend** (`NEXT_PUBLIC_API_BASE` default `https://name-meaning-site-backend.vercel.app`) is a **separate Vercel deployment** — so the app is split across Cloudflare (frontend) + Vercel (backend). Not a problem, but a cost/ops dependency to be aware of. The empty `vercel.json` is dead.

## 6. Blog data

- **Finding:** `public/data/blog-posts.json` contains **66 posts**. The previously-known **duplicate/section bug IS present**. Example confirmed: post `best-islamic-baby-names-2026` has the section **"How Classic Names Compare to Modern Names"** repeated 4 extra times (indices 9, 10, 11, 12, 13 identical). Affected posts include at least: `best-islamic-baby-names-2026`, `how-to-choose-a-baby-name-in-islam`, `most-popular-baby-names-usa-2026-ssa-data-trends`, `hindu-names-inspired-by-nature`, and 15 others (19 total flagged with consecutive duplicates).
- **File(s):** `public/data/blog-posts.json` (66 entries; see `best-islamic-baby-names-2026` → `content.sections[9..13]`)
- **Flag:** ⚠️ **Real content bug** — duplicated section blocks inflate page length and harm readability/SEO. Should be de-duplicated (not done in this audit).

## 7. Build behavior

- **Finding:** `npm run build` = `npm run sitemap:build && next build && npx opennextjs-cloudflare build`. The `next build` step compiles successfully (verified earlier in session: ~43s compile, **144 static pages generated**, only `/blog/[slug]`, `/guides/[slug]`, `/search/[term]`, `/names/[religion]/letter/[letter]` left dynamic/`ƒ`). No bundle-size or dependency errors. Build warnings: "Custom Cache-Control headers detected" for `/_next/*` (expected, harmless), and "Missing environment variables: NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_API_BASE. Using defaults." (the defaults resolve to the live backend, so deploy works but these should be set explicitly in Cloudflare).
- **File(s):** `package.json:7`; build output observed during session
- **Flag:** ⚠️ Build **depends on network** — `sitemap:build` fetches ~40k slugs from the backend API (seen taking minutes in logs). If the backend is down/slow, the build stalls. Also the `next build` step is what `cf:build` wraps; `npm run build` alone does not produce `.open-next` output.

## 8. Environment variables

- **Finding:** Expected vars (all read via `process.env`, **no hardcoding** of secrets):
  - `NEXT_PUBLIC_SITE_URL` — site canonical URL (`src/lib/seo/site.js:7`, etc.)
  - `NEXT_PUBLIC_API_BASE` — backend API base (`src/lib/api/server-fetch.js:20`, `next.config.mjs:1`)
  - `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_API_TIMEOUT`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_ANALYTICS_ID`, `NEXT_PUBLIC_ENABLE_ANALYTICS/PWA/SENTRY`, `NEXT_PUBLIC_RATE_LIMIT`, `NEXT_PUBLIC_RATE_WINDOW_MS`, `NEXT_PUBLIC_BUILD_STATIC`, `NEXT_PUBLIC_STATIC_NAMES_LIMIT`, `NEXT_PUBLIC_STATIC_LANG_LIMIT`, `NEXT_PUBLIC_SKIP_METADATA_FETCH` (`src/config/env.js`)
  - `INDEXNOW_API_KEY` (`scripts/submit-indexnow.js:5`)
  - There is **no MongoDB URI**; the backend is HTTP, so the MongoDB connection-string question is **N/A** — the API base is read from `NEXT_PUBLIC_API_BASE` and falls back to the Vercel backend URL, never hardcoded.
- **File(s):** `src/config/env.js`, `src/lib/api/server-fetch.js:20`, `.env.local` (present, holds the real values)
- **Flag:** ⚠️ `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_BASE` are **not set in Cloudflare** (the build warning confirms this). The app works via defaults, but sitemaps/metadata will point at `https://nameverse.vercel.app` (the default) rather than your real domain until these are set. **Set both in the Cloudflare build environment.**

---

## Summary of flags (performance / cost / quality)

| # | Flag | Area |
|---|------|------|
| 1 | `revalidate = 31536000` vs "30-day" comment mismatch → stale content up to a year | Build/ISR |
| 2 | Name page can fire **30+ API calls** on first (uncached) render (3× slug-filter loops + detail + trending) | Performance |
| 3 | Blog JSON has **19 posts with duplicated sections** (real content bug) | Content/SEO |
| 4 | Frontend on **Cloudflare**, backend API on a **separate Vercel** project — cross-platform dependency | Hosting |
| 5 | **Missing env vars** `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_API_BASE` in Cloudflare (defaulting to vercel.app domain) | Config |
| 6 | Dead code: `serverFetchRelatedNames` / `serverFetchSimilarNames` hardcoded to islamic/1 and unused | Code hygiene |

> No files were modified. This is the complete read-only audit.
