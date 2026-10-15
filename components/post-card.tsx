import Image from "next/image";
import Link from "next/link";
import type { posts } from "@/.velite";
import {
  categoryLabel,
  categoryPath,
  tagPath,
} from "@/lib/content/public-posts";

type Post = (typeof posts)[number];

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group grid gap-5 border-b border-base-300/70 py-7 sm:grid-cols-[13rem_1fr] sm:gap-8">
      <figure className="overflow-hidden rounded-xl bg-base-200">
        <Image
          src={post.cover.src}
          alt=""
          width={post.cover.width}
          height={post.cover.height}
          className="aspect-[16/10] h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(min-width: 640px) 13rem, 100vw"
        />
      </figure>
      <div className="flex flex-col items-start">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tracking-wide text-base-content/55">
          <time dateTime={post.date}>
            {new Intl.DateTimeFormat("ja-JP", { dateStyle: "long" }).format(
              new Date(post.date),
            )}
          </time>
          <span aria-hidden="true">/</span>
          <Link className="link link-hover" href={categoryPath(post.category)}>
            {categoryLabel(post.category)}
          </Link>
        </div>
        <h2 className="mt-2 text-xl font-semibold leading-snug sm:text-2xl">
          <Link
            href={`/posts/${post.slug}`}
            className="link link-hover decoration-1 underline-offset-4"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-base-content/70">
          {post.summary}
        </p>
        <ul aria-label="タグ" className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li key={tag}>
              <Link
                href={tagPath(tag)}
                className="badge badge-outline badge-sm"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
