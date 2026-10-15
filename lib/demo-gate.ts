import { createHmac, timingSafeEqual } from "node:crypto";

export const DEMO_COOKIE_TTL_SECONDS = 15 * 60;
export const DEMO_RATE_LIMIT_ATTEMPTS = 5;
export const DEMO_RATE_LIMIT_WINDOW = "15 m";
export const MAX_ANSWER_LENGTH = 256;
export const MAX_REQUEST_BYTES = 2_048;
export const COOKIE_PREFIX = "amia_demo_";

// This signed bearer token demonstrates request gating; it does not make source content private.
export type DemoClaims = {
  slug: string;
  expiresAt: number;
  nonce: string;
};

export function validDemoSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function validAnswer(answer: unknown): answer is string {
  return (
    typeof answer === "string" &&
    answer.length > 0 &&
    answer.length <= MAX_ANSWER_LENGTH &&
    answer.trim() === answer
  );
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createDemoToken(claims: DemoClaims, secret: string): string {
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyDemoToken(
  token: string | undefined,
  slug: string,
  secret: string,
  now = Math.floor(Date.now() / 1000),
): boolean {
  if (!token || !validDemoSlug(slug)) return false;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;

  const expected = Buffer.from(sign(payload, secret));
  const provided = Buffer.from(signature);
  if (
    expected.length !== provided.length ||
    !timingSafeEqual(expected, provided)
  ) {
    return false;
  }

  try {
    const claims = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as DemoClaims;
    return (
      claims.slug === slug &&
      Number.isInteger(claims.expiresAt) &&
      claims.expiresAt > now &&
      typeof claims.nonce === "string"
    );
  } catch {
    return false;
  }
}

export function demoCookieName(slug: string) {
  if (!validDemoSlug(slug)) throw new Error("Invalid demo slug");
  return `${COOKIE_PREFIX}${slug}`;
}

export function demoCookiePath(slug: string) {
  if (!validDemoSlug(slug)) throw new Error("Invalid demo slug");
  // Send the bearer token only to the matching post's content endpoint.
  return `/api/demo-posts/${slug}/content`;
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function readJsonLimited(
  request: Request,
): Promise<unknown | null> {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_REQUEST_BYTES) return null;

  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let size = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_REQUEST_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  try {
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch {
    return null;
  }
}

export function privateJson(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      Pragma: "no-cache",
      Vary: "Cookie",
    },
  });
}
