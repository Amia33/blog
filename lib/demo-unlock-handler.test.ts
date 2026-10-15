import assert from "node:assert/strict";
import test from "node:test";
import { handleDemoUnlock } from "./demo-unlock-handler.ts";
import type { DemoPost } from "./demo-gate.server.ts";

const post: DemoPost = {
  slug: "fictional-post",
  title: "Synthetic demo",
  category: "demo",
  question: "Sample question?",
  answerHash: "$argon2id$synthetic",
  body: "Fictional body.",
};

function request() {
  return new Request("https://amia.test/api/demo-posts/fictional-post/unlock", {
    method: "POST",
    headers: {
      origin: "https://amia.test",
      "content-type": "application/json",
    },
    body: JSON.stringify({ answer: "synthetic-answer" }),
  });
}

function deps(overrides = {}) {
  const order: string[] = [];
  const cookies: Array<{ name: string; value: string; options: unknown }> = [];
  return {
    order,
    cookies,
    values: {
      isBot: false,
      getPost: async () => {
        order.push("post");
        return post;
      },
      allowAttempt: async () => {
        order.push("limit");
        return true;
      },
      verifyAnswer: async () => {
        order.push("verify");
        return true;
      },
      signingSecret: "test-signing-secret-at-least-32-bytes-long",
      ip: "192.0.2.1",
      setCookie: (name: string, value: string, options: unknown) =>
        cookies.push({ name, value, options }),
      ...overrides,
    },
  };
}

test("prechecked BotID rejects requests before handler work", async () => {
  const state = deps({ isBot: true });
  const response = await handleDemoUnlock(
    request(),
    "fictional-post",
    state.values,
  );
  assert.equal(response.status, 403);
  assert.deepEqual(state.order, []);
});

test("rate limit happens before answer verification and success sets scoped strict cookie", async () => {
  const state = deps();
  const response = await handleDemoUnlock(
    request(),
    "fictional-post",
    state.values,
  );
  assert.equal(response.status, 200);
  assert.deepEqual(state.order, ["limit", "post", "verify"]);
  assert.equal(state.cookies.length, 1);
  assert.equal(state.cookies[0].name, "amia_demo_fictional-post");
  assert.deepEqual(state.cookies[0].options, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/demo-posts/fictional-post/content",
    maxAge: 900,
  });
});

test("missing rate limiter identity fails closed before loading or verifying a post", async () => {
  const state = deps({ ip: null });
  const response = await handleDemoUnlock(
    request(),
    "fictional-post",
    state.values,
  );
  assert.equal(response.status, 503);
  assert.deepEqual(state.order, []);
});

test("failed answer uses generic response and never returns a body", async () => {
  const state = deps({
    verifyAnswer: async () => {
      state.order.push("verify");
      return false;
    },
  });
  const response = await handleDemoUnlock(
    request(),
    "fictional-post",
    state.values,
  );
  assert.equal(response.status, 403);
  assert.deepEqual(await response.json(), {
    error: "Unable to unlock this demo post.",
  });
  assert.equal(state.cookies.length, 0);
});
