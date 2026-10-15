import assert from "node:assert/strict";
import test from "node:test";
import { getSiteUrl } from "../site-url.ts";

test("site URL requires an absolute HTTP(S) origin", () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    assert.throws(() => getSiteUrl(), /NEXT_PUBLIC_SITE_URL is required/);

    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/blog";
    assert.throws(() => getSiteUrl(), /absolute site origin/);

    process.env.NEXT_PUBLIC_SITE_URL = "javascript:alert(1)";
    assert.throws(() => getSiteUrl(), /absolute site origin/);

    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    assert.equal(getSiteUrl(), "https://example.com");
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previous;
  }
});
