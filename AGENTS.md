# Repository guidance

This repository is a **public demo/test implementation** of the Amia blog foundation. Everything checked in is public, including files under `protected/`; only fictional samples belong here. Never add real drafts, personal data, credentials, private assets, real Q&A answers, or content whose disclosure would matter.

## Content and rendering

- Use UTF-8 MDX posts under `content/posts/public/` with validated `title`, unique `slug`, `date`, `summary`, required `category`, `tags`, and cover asset fields. Posts can freely mix Chinese, Japanese, and English; do not add locale-specific post routing.
- Use Velite (`velite.config.ts`) for public schemas, generated types, and asset copying. The public collection must only include `posts/public/**/*.mdx`; only assets in `assets/public/` may be copied. Fail the build for invalid metadata, duplicate slugs, and missing referenced assets.
- Keep the synthetic Q&A demo source in `content/posts/protected/`, outside Velite collections and public indexes. It is still public source. Never put actual secrets or content there. A committed Argon2id answer hash can be attacked offline; the feature is only a non-confidential UX/security demonstration.
- Keep answer verification and protected-content loading server-only. Never pass hashes or gated body to client code, static HTML, metadata, sitemap, RSS, search, or public assets. The public `/demo/` route must defer body delivery until server verification and the content API must check the post-scoped HttpOnly token on every request with private/no-store responses.
- BotID, WAF rules, and rate limits are abuse mitigation, not authentication. Keep BotID client route/method configuration aligned with server `checkBotId()`. Apply BotID before parsing or hashing. Use Vercel's trusted client IP header only; never key limits off user-controlled `x-forwarded-for`. Fail closed when shared Upstash limiter or token-signing configuration is missing.
- The unlock endpoint has layered limits: WAF guidance is 20 unlock requests/IP/10 minutes (per-region counters); Upstash app limit is 5 answer submissions/post/IP/15 minutes, including successful submissions and counted before Argon2 verification. Do not describe those limits as globally exact or equivalent to identity verification.
- MDX comes from trusted repository authors. Keep the AST policy that disallows imports/exports, JavaScript expressions, and components outside the explicit allowlist. Add reviewed components only to `mdx-components.tsx`; render on the server and do not enable raw HTML or unrestricted evaluation.
- Public/protected directory names are organization only, not access control. Add inline SVG icons when needed; decorative SVGs are `aria-hidden` and icon-only controls have accessible names. Do not bundle a full icon or emoji font without a measured need.

## UI and code

- Keep Next.js App Router, TypeScript, pnpm, Tailwind CSS 4, daisyUI 5, Prettier, ESLint, and Stylelint. Prefer semantic daisyUI colors and responsive utilities; follow `.commandcode/skills/daisyui/` before UI changes.
- Keep Japanese interface labels separate from article languages. Use M PLUS 1 for Japanese/Latin sans text, M PLUS 1 Code for code, and Noto Sans SC plus platform fallbacks for Chinese glyph coverage. Inspect mixed-script rendering; the configured Google font subset may not include CJK glyphs.
- Before implementing Next.js APIs, consult version-matched docs in `node_modules/next/dist/docs/`. This project uses Cache Components; never put cookie-/authorization-dependent content into `use cache` or static generation.
- Scaffold posts with `pnpm new:post`; use `pnpm new:post --demo-gated` only for synthetic examples. Validate output with `pnpm content:build`.
- Run `pnpm test`, `pnpm content:build`, `pnpm lint`, `pnpm lint:styles`, `pnpm format:check`, TypeScript checks, and `pnpm build` as appropriate.

## External demo configuration

Vercel Firewall/WAF rules are configured manually in the project dashboard, not checked into this repo. Recommended unlock rule: `POST /api/demo-posts/:slug/unlock`, source IP, 20 requests per 10 minutes, initially observe in Log mode then use 429. Review regional counter behavior and Vercel plan limits. BotID checks are enabled in deployed environments; local dev generally reports non-bot by default.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
