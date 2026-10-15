import argon2 from "argon2";

export function hashDemoAnswer(answer: string) {
  return argon2.hash(answer, { type: argon2.argon2id });
}

export function verifyDemoAnswerHash(hash: string, answer: string) {
  return argon2.verify(hash, answer);
}
