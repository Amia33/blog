import assert from "node:assert/strict";
import test from "node:test";
import {
  getPublicFeed,
  getPublicSitemap,
} from "../lib/content/public-output.ts";
import robots from "../app/robots.ts";

process.env.NEXT_PUBLIC_SITE_URL = "https://amia.example";

test("public RSS, robots, and sitemap list only public collection routes", () => {
  const urls = getPublicSitemap().map((entry) => entry.url);
  assert.ok(urls.every((url) => !url.includes("/demo/")));
  assert.ok(urls.some((url) => url.includes("/posts/three-languages")));
  assert.deepEqual(robots().rules[0].disallow, ["/demo/", "/api/demo-posts/"]);

  const xml = getPublicFeed();
  assert.match(xml, /three-languages/);
  assert.doesNotMatch(xml, /fictional-post|answerHash|moon-paper-7/);
});
