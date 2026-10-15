import path from "node:path";

export function slugifyTitle(title: string) {
  return title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidPostSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function resolvePostPath(root: string, slug: string, gated = false) {
  if (!isValidPostSlug(slug)) throw new Error("Invalid post slug");
  return path.join(
    root,
    "content/posts",
    gated ? "protected" : "public",
    `${slug}.mdx`,
  );
}

export function resolveCoverPath(root: string, cover: string) {
  const base = path.resolve(root, "content/assets/public");
  const resolved = path.resolve(base, cover);
  if (!resolved.startsWith(`${base}${path.sep}`))
    throw new Error("Cover must be inside content/assets/public");
  return resolved;
}

export function isValidPostDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return (
    !Number.isNaN(parsed.valueOf()) &&
    parsed.toISOString().slice(0, 10) === date
  );
}
