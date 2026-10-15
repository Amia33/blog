import { getPublicFeed } from "@/lib/content/public-output";

export function GET() {
  return new Response(getPublicFeed(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
