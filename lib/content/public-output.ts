import { posts } from "../../.velite/index.js";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://amia.example";

export function getPublicSitemap() {
  return [
    { url: siteUrl, changeFrequency: "weekly" as const, priority: 1 },
    {
      url: `${siteUrl}/posts`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...posts.map((post) => ({
      url: `${siteUrl}/posts/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function getPublicFeed() {
  const items = posts
    .map(
      (post) =>
        `<item><title>${escapeXml(post.title)}</title><link>${siteUrl}/posts/${post.slug}</link><guid>${siteUrl}/posts/${post.slug}</guid><pubDate>${new Date(post.date).toUTCString()}</pubDate><description>${escapeXml(post.summary)}</description></item>`,
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Amia</title><link>${siteUrl}</link><description>日々の記録</description>${items}</channel></rss>`;
}
