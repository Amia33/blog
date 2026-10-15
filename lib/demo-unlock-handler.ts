import {
  createDemoToken,
  demoCookieName,
  demoCookiePath,
  DEMO_COOKIE_TTL_SECONDS,
  isSameOrigin,
  privateJson,
  readJsonLimited,
  validAnswer,
  validDemoSlug,
} from "./demo-gate.ts";

export type DemoPost = {
  slug: string;
  title: string;
  category: string;
  question: string;
  answerHash: string;
  body: string;
};

export type UnlockDependencies = {
  isBot: boolean;
  getPost: (slug: string) => Promise<DemoPost | null>;
  allowAttempt: (slug: string, ip: string) => Promise<boolean>;
  verifyAnswer: (post: DemoPost, answer: string) => Promise<boolean>;
  signingSecret: string | null;
  ip: string | null;
  setCookie: (
    name: string,
    value: string,
    options: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: "strict";
      path: string;
      maxAge: number;
    },
  ) => void;
};

export async function handleDemoUnlock(
  request: Request,
  slug: string,
  dependencies: UnlockDependencies,
) {
  if (dependencies.isBot) return privateJson({ error: "Request denied." }, 403);
  if (
    !dependencies.signingSecret ||
    !validDemoSlug(slug) ||
    !isSameOrigin(request)
  ) {
    return privateJson({ error: "Unable to unlock this demo post." }, 400);
  }

  const data = await readJsonLimited(request);
  if (
    !data ||
    typeof data !== "object" ||
    !("answer" in data) ||
    !validAnswer(data.answer)
  ) {
    return privateJson({ error: "Unable to unlock this demo post." }, 400);
  }
  if (!dependencies.ip)
    return privateJson({ error: "Unable to unlock this demo post." }, 503);
  // Count every submission before loading the record or running Argon2 verification.
  if (!(await dependencies.allowAttempt(slug, dependencies.ip))) {
    return privateJson({ error: "Unable to unlock this demo post." }, 429);
  }

  const post = await dependencies.getPost(slug);
  if (!post || !(await dependencies.verifyAnswer(post, data.answer))) {
    return privateJson({ error: "Unable to unlock this demo post." }, 403);
  }

  const claims = {
    slug,
    expiresAt: Math.floor(Date.now() / 1000) + DEMO_COOKIE_TTL_SECONDS,
    nonce: crypto.randomUUID(),
  };
  dependencies.setCookie(
    demoCookieName(slug),
    createDemoToken(claims, dependencies.signingSecret),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: demoCookiePath(slug),
      maxAge: DEMO_COOKIE_TTL_SECONDS,
    },
  );
  return privateJson({ success: true });
}
