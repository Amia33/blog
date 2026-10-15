import type { MetadataRoute } from "next";
import { getPublicSitemap } from "@/lib/content/public-output";

export default function sitemap(): MetadataRoute.Sitemap {
  return getPublicSitemap();
}
