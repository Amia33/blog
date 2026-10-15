# Repository guidance

This repository is a **public demo/test implementation** of the Amia blog foundation. All checked-in content and assets must be fictional samples. Never add real drafts, private assets, credentials, or real Q&A answers. The production site belongs in a separate private repository containing both the app and its own `content/` dataset; do not connect this public demo to real content.

## Content and rendering

- Use UTF-8 MDX posts under `content/posts/public/` with validated `title`, unique `slug`, `date`, `summary`, `tags`, and cover asset fields. Posts can freely mix Chinese, Japanese, and English; do not add language-specific post routing or translation requirements.
- Define site settings and interface copy in `content/settings/`. UI hint labels are Japanese (examples: `タグ`, `公開日`, `関連記事`) and are separate from post language. Anything rendered publicly is public; settings must not contain credentials.
- Use Velite (`velite.config.ts`) for content schemas, generated types, and asset copying. The public collection must only include `posts/public/**/*.mdx`; public assets must only come from `assets/public/`. Add schema constraints when extending content metadata and fail the build on invalid entries or missing referenced assets.
- MDX comes from trusted repository authors only. Keep the AST policy that disallows imports/exports, JavaScript expressions, and components outside the explicit allowlist. Add only reviewed components to `mdx-components.tsx`; keep rendering on the server and never pass compiled MDX source into client components. Do not enable raw HTML or unrestricted evaluation.
- Public/protected directory names are organizational boundaries, not access control. This public repository must only contain synthetic examples, including under protected paths. In the future private production repository, protected text/assets must stay out of static output, client bundles, metadata, indexes, and public assets. Do not implement reveal/gating as client-side hiding.
- Add blog icons as small reusable inline SVG components when needed; mark decorative SVGs `aria-hidden` and give icon-only controls accessible names. Do not add a full icon font or emoji font without a measured requirement.

## UI and code

- Keep Next.js App Router, TypeScript, pnpm, Tailwind CSS 4, daisyUI 5, Prettier, ESLint, and Stylelint. Prefer daisyUI semantic colors and responsive utilities; use existing component guidance in `.commandcode/skills/daisyui/` when changing UI.
- Use M PLUS 1 for primary Japanese/Latin sans text, M PLUS 1 Code for code, and Noto Sans SC plus platform fallbacks for Chinese glyph coverage. Inspect actual mixed-script rendering rather than assuming the Latin font subset includes CJK glyphs.
- Before implementing Next.js APIs, consult the version-matched docs in `node_modules/next/dist/docs/`. The installed Next.js version may differ from remembered APIs.
- Run `pnpm content:build`, `pnpm lint`, `pnpm lint:styles`, `pnpm format:check`, and `pnpm build` as appropriate after changes.

## Deployment boundary

The future production repository should be private, owned by the personal GitHub account, and connected directly to Vercel. Keep the current public repository self-contained and buildable from its synthetic sample dataset without private credentials, submodules, or package-registry access.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
