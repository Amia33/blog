import assert from "node:assert/strict";
import test from "node:test";
import {
  createDemoToken,
  demoCookieName,
  demoCookiePath,
  isSameOrigin,
  validAnswer,
  validDemoSlug,
  verifyDemoToken,
  DEMO_RATE_LIMIT_ATTEMPTS,
  DEMO_RATE_LIMIT_WINDOW,
} from "./demo-gate.ts";
import {
  isValidPostDate,
  isValidPostSlug,
  resolveCoverPath,
  resolvePostPath,
  slugifyTitle,
} from "./content/post-scaffold.ts";

const secret = "test-only-secret-which-is-at-least-32-bytes-long";

test("post slugs accept only lowercase ASCII hyphenated forms", () => {
  assert.equal(slugifyTitle("A Public Note"), "a-public-note");
  assert.equal(slugifyTitle("日本語の記事"), "");
  assert.equal(isValidPostSlug("a-public-note"), true);
  assert.equal(isValidPostSlug("../private"), false);
  assert.throws(() => resolvePostPath("/repo", "../secret"));
  assert.match(
    resolvePostPath("/repo", "a-note"),
    /content\/posts\/public\/a-note\.mdx$/,
  );
  assert.match(
    resolvePostPath("/repo", "a-note", true),
    /content\/posts\/protected\/a-note\.mdx$/,
  );
});

test("date and cover path validation rejects invalid values and traversal", () => {
  assert.equal(isValidPostDate("2026-10-15"), true);
  assert.equal(isValidPostDate("2026-02-30"), false);
  assert.throws(() => resolveCoverPath("/repo", "../../private.svg"));
});

test("application limiting allows five failures per fifteen-minute window", () => {
  assert.equal(DEMO_RATE_LIMIT_ATTEMPTS, 5);
  assert.equal(DEMO_RATE_LIMIT_WINDOW, "15 m");
});

test("demo tokens are scoped, signed, and expire", () => {
  const token = createDemoToken(
    { slug: "fictional-post", expiresAt: 200, nonce: "test" },
    secret,
  );
  assert.equal(verifyDemoToken(token, "fictional-post", secret, 100), true);
  assert.equal(verifyDemoToken(token, "another-post", secret, 100), false);
  assert.equal(verifyDemoToken(token, "fictional-post", secret, 200), false);
  assert.equal(
    verifyDemoToken(`${token}x`, "fictional-post", secret, 100),
    false,
  );
  assert.equal(demoCookieName("fictional-post"), "amia_demo_fictional-post");
  assert.equal(
    demoCookiePath("fictional-post"),
    "/api/demo-posts/fictional-post/content",
  );
  assert.throws(() => demoCookiePath("../nope"));
});

test("unlock input validators and origin policy reject malformed requests", () => {
  assert.equal(validDemoSlug("fictional-post"), true);
  assert.equal(validDemoSlug("../private"), false);
  assert.equal(validAnswer("answer"), true);
  assert.equal(validAnswer(" answer"), false);
  assert.equal(validAnswer("x".repeat(257)), false);
  assert.equal(
    isSameOrigin(
      new Request("https://site.test/api", {
        headers: { origin: "https://site.test" },
      }),
    ),
    true,
  );
  assert.equal(
    isSameOrigin(
      new Request("https://site.test/api", {
        headers: { origin: "https://elsewhere.test" },
      }),
    ),
    false,
  );
});
