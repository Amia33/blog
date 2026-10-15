import assert from "node:assert/strict";
import test from "node:test";
import {
  handleDemoContent,
  handleDemoContentRequest,
} from "./demo-content-handler.ts";
import { createDemoToken } from "./demo-gate.ts";
import type { DemoPost } from "./demo-unlock-handler.ts";

const post: DemoPost = {
  slug: "fictional-post",
  title: "Synthetic demo",
  category: "demo",
  question: "Synthetic?",
  answerHash: "$argon2id$synthetic",
  body: "Fictional body only.",
};
const secret = "test-only-signing-secret-with-more-than-32-bytes";
const token = createDemoToken(
  { slug: post.slug, expiresAt: 200, nonce: "test" },
  secret,
);

function verify(value: string | undefined, slug: string, key: string) {
  return value === token && slug === post.slug && key === secret;
}

test("content handler never returns body without a valid post-scoped token", async () => {
  const result = await handleDemoContent(post.slug, undefined, secret, {
    getPost: async () => post,
    verifyToken: verify,
  });
  assert.equal(result.status, 404);
  assert.doesNotMatch(await result.text(), /Fictional body only/);
  assert.match(result.headers.get("cache-control") ?? "", /private, no-store/);
});

test("content handler returns only authorized body with private no-store headers", async () => {
  const result = await handleDemoContent(post.slug, token, secret, {
    getPost: async () => post,
    verifyToken: verify,
  });
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { body: post.body });
  assert.match(result.headers.get("cache-control") ?? "", /private, no-store/);
  assert.equal(result.headers.get("vary"), "Cookie");
});

test("content token cannot unlock another slug", async () => {
  const result = await handleDemoContent("another-post", token, secret, {
    getPost: async () => post,
    verifyToken: verify,
  });
  assert.equal(result.status, 404);
  assert.doesNotMatch(await result.text(), /Fictional body only/);
});

test("invalid content slug returns not found before reading a cookie", async () => {
  let cookieRead = false;
  let postLoaded = false;
  const result = await handleDemoContentRequest(
    "Invalid_Slug",
    async () => {
      cookieRead = true;
      return token;
    },
    secret,
    {
      getPost: async () => {
        postLoaded = true;
        return post;
      },
      verifyToken: verify,
    },
  );

  assert.equal(result.status, 404);
  assert.equal(cookieRead, false);
  assert.equal(postLoaded, false);
});
