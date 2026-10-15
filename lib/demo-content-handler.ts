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

  // Validate the post-scoped bearer token on every request before loading its body.
  if (!dependencies.verifyToken(token, slug, secret)) {
    return privateJson({ error: "Post not available." }, 404);
  }

  const post = await dependencies.getPost(slug);
  if (!post) return privateJson({ error: "Post not available." }, 404);
  return privateJson({ body: post.body });
}

export async function handleDemoContentRequest(
  slug: string,
  getToken: (cookieName: string) => Promise<string | undefined>,
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
  if (!validDemoSlug(slug)) {
    return privateJson({ error: "Post not available." }, 404);
  }

  const token = await getToken(demoCookieName(slug));
  return handleDemoContent(slug, token, secret, dependencies);
}
