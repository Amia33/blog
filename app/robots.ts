import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://amia.example";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/demo/", "/api/demo-posts/"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
