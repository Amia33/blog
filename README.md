# Amia blog demo

This public repository is a runnable Next.js blog demo. All checked-in posts, settings, answers, and assets are fictional. **Never add real drafts, personal data, credentials, private assets, or Q&A answers here.**

## Stack and routes

- Next.js 16 App Router, React, TypeScript, Tailwind CSS 4, and daisyUI 5
- Velite validates public MDX posts and copies referenced public assets
- Prettier, ESLint, Stylelint, and Node’s built-in test runner
- Public routes: `/`, `/posts`, `/posts/[slug]`, `/categories/[category]`, `/tags/[tag]`, `/search`, `/about`
- Demo-only route: `/demo/[slug]`, backed by separate request-time API endpoints

## Local setup and checks

Use Node.js 20+ and pnpm 12.11.2.

```bash
pnpm install
pnpm dev
```

`pnpm dev` validates/builds public content, watches content changes, and starts Next.js.

```bash
pnpm content:build
pnpm test
pnpm lint
pnpm lint:styles
pnpm format:check
pnpm exec tsc --noEmit
pnpm build
```

## Authoring posts

Create a public post with:

```bash
pnpm new:post
```

The helper asks for title, slug, date, summary, category, tags, and a cover beneath `content/assets/public/`; it refuses unsafe paths and overwrites. Non-Latin titles need an explicit ASCII slug. The post schema in `velite.config.ts` requires title, unique slug, date, summary, category, at least one tag, and a valid referenced cover. Public source lives under `content/posts/public/`; article prose can mix Chinese, Japanese, and English without locale routing.

To scaffold a **fictional demo-gated** post, use `pnpm new:post --demo-gated`. The tool asks for a synthetic answer without echoing it and writes only an Argon2id hash into protected frontmatter. The helper’s output remains public in Git. Never use real answer secrets or private content.

MDX allows only reviewed components such as `<Details summary="...">...</Details>`. Its AST policy rejects imports/exports, expressions, raw HTML, and unsupported JSX components. Public posts/assets are generated from public paths only. Protected samples are loaded by a server-only demo loader and are excluded from Velite, public asset output, static pages, indexes, metadata, sitemap, RSS, and search.

## Q&A gate warning and optional services

The Q&A route is a **non-confidential software demonstration**, not authentication or access control suitable for secrets. An answer hash committed to a public repository is available for offline guessing; a cookie only illustrates server-side request checks. The demo record’s answer and body are synthetic and intentionally public.

To enable the unlock endpoint in a deployment, configure:

- `REDIS_KV_REST_API_URL`
- `REDIS_KV_REST_API_TOKEN` (the read/write REST token; do not use the read-only token for rate limiting)
- `DEMO_GATE_SIGNING_SECRET` (at least 32 characters; use a random secret)
- `NEXT_PUBLIC_SITE_URL` (canonical site origin for metadata/feed links)

Without Upstash or signing configuration, the unlock path fails closed while ordinary public routes still work. Rate-limit layers for `POST /api/demo-posts/:slug/unlock`:

- BotID classifies/challenges automated traffic. Client `instrumentation-client.ts` and server `checkBotId()` must match. BotID is not authentication or a rate limiter. Locally it generally reports non-bot; a deployed preview/browser-originated request is required to validate its challenge path.
- Recommended manual Vercel Firewall/WAF rule: match `POST /api/demo-posts/:slug/unlock`, count by source IP, 20 requests per 10 minutes, begin in Log mode and then use 429. Counters are per-region and not a globally exact cap.
- Upstash shared application limiter: 5 answer submissions per post/IP per 15 minutes, including successful submissions. Each attempt is counted before Argon2id verification to bound expensive work. Only use the trusted Vercel client IP header; do not trust user-provided `x-forwarded-for`.

The content endpoint verifies a short-lived slug-bound HttpOnly cookie on every request and returns `private, no-store`. None of these controls makes this public demo’s sample content confidential.

## Deployment notes

The Vercel Firewall rule is a dashboard setting and is not automatically configured by this repository. Review Firewall behavior and plan limits before applying it. Public output intentionally excludes gated demo bodies, hashes, and records from Velite and public indexes.
