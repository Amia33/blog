import { demoCookieName, privateJson, validDemoSlug } from "./demo-gate.ts";
import type { DemoPost } from "./demo-unlock-handler.ts";

export async function handleDemoContent(
  slug: string,
  token: string | undefined,
  secret: string | null,
  dependencies: {
    getPost: (slug: string) => Promise<DemoPost | null>;
    verifyToken: (
      token: string | undefined,
      slug: string,
      secret: string,
    ) => boolean;
  },
) {
  if (!secret || !validDemoSlug(slug)) {
    return privateJson({ error: "Post not available." }, 404);
  }

  if (!dependencies.verifyToken(token, slug, secret)) {
    return privateJson({ error: "Post not available." }, 404);
  }

  const post = await dependencies.getPost(slug);
  if (!post) return privateJson({ error: "Post not available." }, 404);
  return privateJson({ body: post.body });
}

export function demoContentCookieName(slug: string) {
  return demoCookieName(slug);
}
