import assert from "node:assert/strict";
import test from "node:test";
import {
  isValidPostDate,
  isValidPostSlug,
  resolveCoverPath,
  resolvePostPath,
  slugifyTitle,
} from "../lib/content/post-scaffold.ts";

const root = process.cwd();

test("post scaffold validates fields and confines output paths", () => {
  assert.equal(slugifyTitle("Fictional Public Post"), "fictional-public-post");
  assert.equal(slugifyTitle("日本語の題名"), "");
  assert.equal(isValidPostSlug("fictional-post"), true);
  assert.equal(isValidPostSlug("../private"), false);
  assert.equal(isValidPostDate("2026-10-15"), true);
  assert.equal(isValidPostDate("2026-02-30"), false);
  assert.match(
    resolvePostPath(root, "fictional-post"),
    /content\/posts\/public\/fictional-post\.mdx$/,
  );
  assert.match(
    resolvePostPath(root, "fictional-post", true),
    /content\/posts\/protected\/fictional-post\.mdx$/,
  );
  assert.match(
    resolveCoverPath(root, "morning-window.svg"),
    /content\/assets\/public\/morning-window\.svg$/,
  );
  assert.throws(() => resolveCoverPath(root, "../../private.svg"));
  assert.throws(() => resolvePostPath(root, "../private"));
});
