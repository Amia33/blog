# Public demo follow-ups

- [ ] Configure a web application firewall (WAF) rule in Vercel Firewall for `POST /api/demo-posts/:slug/unlock`: observe in Log mode, then rate-limit at 20 requests per source IP per 10 minutes with a 429 response. WAF counters are per-region; Upstash remains the shared app limiter.
- [ ] Configure Upstash Redis env vars (`REDIS_KV_REST_API_URL`, `REDIS_KV_REST_API_TOKEN`) and `DEMO_GATE_SIGNING_SECRET` in the Vercel preview project to enable the synthetic Q&A flow. Use the REST API token with write access; the read-only token and Redis connection-string variables are not used. Without the required values the unlock route fails closed.
- [ ] Enable and test BotID in a deployed preview; local development reports non-bot by default. Protect only the unlock POST and use browser-originated requests when verifying production behavior.
- [ ] Review Japanese labels and mixed Chinese/Japanese/English font rendering at mobile and desktop sizes.
- [ ] Add additional fictional sample content/assets where needed. Never add actual drafts, personal details, answer secrets, or private assets to this public repository.
- [ ] Keep the Q&A example low-assurance and non-confidential. A committed Argon2id hash permits offline guessing; Q&A and its signed cookie do not provide identity or confidentiality.
- [ ] Review the public-output leakage test whenever the Velite schema, gated content loader, public metadata, RSS, sitemap, or search changes.
