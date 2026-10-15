# Amia blog demo

This public repository is a runnable Next.js blog foundation. All posts, settings, and assets in it are synthetic examples. **Never add real drafts, private assets, credentials, or Q&A answers here.** The production blog should be a separate private repository containing the app and its real `content/` directory.

## Stack

- Next.js 16 App Router, React, and TypeScript
- Tailwind CSS 4 with daisyUI 5
- Velite for MDX collections, schemas, type generation, and public asset processing
- Prettier, ESLint, and Stylelint
- M PLUS 1, M PLUS 1 Code, and Noto Sans SC/system fallback for mixed Japanese, English, and Chinese text

## Local development

Use pnpm 12.11.2 and Node.js 20+.

```bash
pnpm install
pnpm dev
```

`pnpm dev` validates and generates the public content, watches the content directory, and starts Next.js. Open `http://localhost:3000`.

```bash
pnpm content:build
pnpm lint
pnpm lint:styles
pnpm format:check
pnpm build
```

## Authoring content

Add public posts under `content/posts/public/<slug>.mdx`. A post needs `title`, `slug`, `date`, `summary`, `tags`, and a relative `cover` image. The schema in `velite.config.ts` validates required fields and unique slugs at build time. Use UTF-8; article text can mix Chinese, Japanese, and English without locale routing.

Public images live in `content/assets/public/` and are copied to generated, hashed paths under `public/static/`. Reference them relative to a post, for example `../../assets/public/morning-window.svg`. Site/UI copy is in `content/settings/`; any settings rendered into the site are public and must not contain secrets.

MDX supports the approved `<Details summary="...">...</Details>` component. Content validation rejects imports, exports, JavaScript expressions, and unsupported JSX component names. The demo's `content/posts/protected/` and `content/assets/protected/` are excluded from the public content pipeline, but this repository is public, so even those files are visible in Git. They contain synthetic placeholders only and do not demonstrate real access control.

## Production repository and Vercel

Create a separate private GitHub repository under your personal account by copying/continuing the app and its content contract. Put real posts, assets, and settings in that private repository's own `content/` directory; do not use this public demo as the production content store and do not add a private submodule. Connect the private app repository to Vercel through the GitHub integration. Vercel's documented private personal-account flow requires the repository owner to grant Vercel access; organization-owned private repositories have different commit-author/team rules.

The source repository being private does not make published pages private. Anything rendered into public HTML, metadata, client code, feeds, indexes, or public assets is available to visitors. The planned per-post Q&A feature is not implemented here. Confidential content must stay out of public/static output and later require server-side authorization with isolated private/no-store delivery; a Q&A answer by itself is not strong authentication.

## Validation and formatting

Use `pnpm format` to format files, `pnpm lint` for ESLint, and `pnpm lint:styles` for Stylelint. Run `pnpm content:build` after changing post metadata/assets, and `pnpm build` before deployment.
