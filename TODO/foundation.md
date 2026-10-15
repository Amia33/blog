# Foundation follow-ups

- [ ] Create the separate private production repository under the personal GitHub account; keep its application and real `content/` dataset together, separate from this public synthetic demo.
- [ ] Connect the private production repository directly to Vercel and confirm GitHub integration permissions, preview deployments, and plan limits.
- [ ] Review mixed-script rendering in target browsers. `next/font/google` in the installed Next version exposes only the Latin Noto Sans SC subset; verify which system fallback supplies Chinese glyphs or self-host a verified CJK font subset if consistent glyph coverage is required.
- [ ] Design per-post Q&A access before implementation. Define the threat model and whether this is a lightweight spoiler barrier or confidential access; Q&A alone is not authentication.
- [ ] For confidential gated content, keep protected source out of public collections, generated assets, static HTML, metadata, feeds, indexes, and client bundles. Read it only after server-side authorization and serve via request-time private/no-store responses with cache isolation.
- [ ] Keep expected answers server-side; consider rate limiting and abuse controls for answer submissions.
- [ ] Add leakage tests with unique protected-content sentinels, unauthorized-response checks, cross-user cache-isolation checks, and inspection of generated Next/Vercel output.
