# Working-sample refinements

This backlog covers broader engineering improvements identified while documenting the runnable sample. Deployment-specific setup remains in [foundation.md](./foundation.md).

- [ ] Decide whether `content/settings/site.yaml` and `content/settings/ui-labels.yaml` should become validated runtime inputs; otherwise remove the unused examples and document where settings belong.
- [ ] Add CI checks for `pnpm content:build`, `pnpm test`, `pnpm lint`, `pnpm lint:styles`, `pnpm format:check`, `pnpm exec tsc --noEmit`, and `pnpm build`. The repository currently has dependency update configuration but no checked-in CI workflow.
- [ ] Add higher-level coverage for API route wiring and deployed BotID behavior while retaining unit tests for ordering, token scope, limits, and no-store responses.
- [ ] Define a size/latency threshold for public search and evaluate server-side indexing or a dedicated search index before client-delivered compiled post content becomes unwieldy.
- [ ] Write down the repository and deployment boundary required before using real private content; keep this public sample synthetic and do not treat its protected directory, hashes, or cookies as confidentiality controls.
