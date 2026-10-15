import { posts } from "@/.velite";

export const publicPosts = [...posts].sort((first, second) =>
  second.date.localeCompare(first.date),
);

export const categories = [
  ...new Set(publicPosts.map((post) => post.category)),
].sort();

export const tags = [...new Set(publicPosts.flatMap((post) => post.tags))].sort(
  (first, second) => first.localeCompare(second, "ja"),
);

export function categoryLabel(category: string) {
  return category.replaceAll("-", " ");
}

export function categoryPath(category: string) {
  return `/categories/${encodeURIComponent(category)}`;
}

export function tagPath(tag: string) {
  return `/tags/${encodeURIComponent(tag)}`;
}
