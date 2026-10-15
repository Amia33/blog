import assert from "node:assert/strict";
import test from "node:test";
import { hashDemoAnswer, verifyDemoAnswerHash } from "./demo-answer.ts";

test("Argon2id verifies only the matching synthetic answer", async () => {
  const hash = await hashDemoAnswer("fictional-answer-for-test");
  assert.match(hash, /^\$argon2id\$/);
  assert.equal(
    await verifyDemoAnswerHash(hash, "fictional-answer-for-test"),
    true,
  );
  assert.equal(await verifyDemoAnswerHash(hash, "different-answer"), false);
});
