# Working-sample refinements

This backlog covers broader engineering improvements identified while documenting the runnable sample. Deployment-specific setup remains in [foundation.md](./foundation.md).

- [x] Keep `content/settings/site.yaml` and `content/settings/ui-labels.yaml` as unused examples, and document their status. Site metadata now uses validated `NEXT_PUBLIC_SITE_URL`; defer parsing UI labels until a validated settings source is needed.
- [ ] Add CI checks for `pnpm content:build`, `pnpm test`, `pnpm lint`, `pnpm lint:styles`, `pnpm format:check`, `pnpm exec tsc --noEmit`, and `pnpm build`. The repository currently has dependency update configuration but no checked-in CI workflow. **Intentionally deferred; do not implement as part of the current findings work.**
- [x] Add unit coverage for API content-route request wiring, including invalid slug rejection before cookie access, while retaining tests for ordering, token scope, limits, and no-store responses.
- [ ] Verify BotID challenge behavior against a deployed preview; local mocks cannot establish deployed behavior.
- [ ] Track the serialized public search payload and keystroke filtering on a representative mobile device; when metadata exceeds 250 KiB uncompressed or filtering exceeds 100 ms, evaluate server-side search or a dedicated index. Search currently sends metadata and summaries, not compiled article bodies.
- [x] Document the boundary for any future real private content: a separate private content repository/submodule and separate private deployment with access controls. Never check that content out in or deploy it from this public demo; keep its protected samples, hashes, and cookies non-confidential.
