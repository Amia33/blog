import type { MetadataRoute } from "next";
import { getSiteUrl } from "../lib/site-url.ts";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/demo/", "/api/demo-posts/"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
