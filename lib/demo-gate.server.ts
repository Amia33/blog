import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { verifyDemoAnswerHash } from "./demo-answer.ts";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import {
  DEMO_RATE_LIMIT_ATTEMPTS,
  DEMO_RATE_LIMIT_WINDOW,
  validDemoSlug,
  verifyDemoToken,
} from "./demo-gate.ts";

export type DemoPost = {
  slug: string;
  title: string;
  category: string;
  question: string;
  answerHash: string;
  body: string;
};

const postsRoot = path.join(process.cwd(), "content/posts/protected");
const postCache = new Map<string, DemoPost | null>();

export async function getDemoPost(slug: string): Promise<DemoPost | null> {
  if (!validDemoSlug(slug)) return null;
  const cached = postCache.get(slug);
  if (cached !== undefined) return cached;

  try {
    const file = await readFile(path.join(postsRoot, `${slug}.mdx`), "utf8");
    const { data, content } = matter(file);
    if (
      data.slug !== slug ||
      typeof data.title !== "string" ||
      typeof data.category !== "string" ||
      typeof data.question !== "string" ||
      typeof data.answerHash !== "string" ||
      !data.answerHash.startsWith("$argon2id$")
    ) {
      postCache.set(slug, null);
      return null;
    }

    const post = {
      slug,
      title: data.title,
      category: data.category,
      question: data.question,
      answerHash: data.answerHash,
      body: content.trim(),
    };
    postCache.set(slug, post);
    return post;
  } catch {
    postCache.set(slug, null);
    return null;
  }
}

export async function verifyDemoAnswer(post: DemoPost, answer: string) {
  return verifyDemoAnswerHash(post.answerHash, answer);
}

let limiter: Ratelimit | undefined;

function getLimiter() {
  const url = process.env.REDIS_KV_REST_API_URL;
  const token = process.env.REDIS_KV_REST_API_TOKEN;
  if (!url || !token) return null;

  limiter ??= new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(
      DEMO_RATE_LIMIT_ATTEMPTS,
      DEMO_RATE_LIMIT_WINDOW,
    ),
    prefix: "amia-demo-unlock",
  });
  return limiter;
}

export async function allowDemoAttempt(slug: string, ip: string) {
  const activeLimiter = getLimiter();
  if (!activeLimiter) return false;
  const result = await activeLimiter.limit(`${slug}:${ip}`);
  return result.success;
}

export function demoSigningSecret() {
  const secret = process.env.DEMO_GATE_SIGNING_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

export function validDemoToken(
  token: string | undefined,
  slug: string,
  secret: string,
) {
  return verifyDemoToken(token, slug, secret);
}
