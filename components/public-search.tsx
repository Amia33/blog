"use client";

import { useMemo, useState } from "react";
import type { posts } from "@/.velite";
import { PostList } from "@/components/post-list";

type Post = (typeof posts)[number];

export function PublicSearch({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return [];
    return posts.filter((post) =>
      [post.title, post.summary, post.category, ...post.tags, post.content]
        .join(" ")
        .toLocaleLowerCase()
        .includes(needle),
    );
  }, [posts, query]);

  return (
    <section className="py-8" aria-labelledby="search-label">
      <label id="search-label" htmlFor="post-search" className="label">
        <span className="label-text text-base">公開記事を検索</span>
      </label>
      <input
        id="post-search"
        className="input input-bordered mt-2 min-h-12 w-full max-w-2xl text-base"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        autoComplete="off"
      />
      <p
        className="py-5 text-sm text-base-content/60"
        role="status"
        aria-live="polite"
      >
        {query.trim()
          ? `${results.length} 件見つかりました。`
          : "検索語を入力してください。"}
      </p>
      {query.trim() && <PostList posts={results} />}
    </section>
  );
}
