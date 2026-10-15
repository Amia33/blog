import { PostCard } from "@/components/post-card";
import type { posts } from "@/.velite";

type Post = (typeof posts)[number];

export function PostList({ posts: items }: { posts: Post[] }) {
  if (items.length === 0) {
    return (
      <p className="border-b border-base-300/70 py-10 text-base-content/65">
        まだ記事はありません。
      </p>
    );
  }

  return (
    <div>
      {items.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
