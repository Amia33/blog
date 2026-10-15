import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/.velite";
import { PostBody } from "@/components/post-body";
import { PostList } from "@/components/post-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  categoryLabel,
  categoryPath,
  tagPath,
} from "@/lib/content/public-posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  if (!post) return {};

  return {
    title: `${post.title} | Amia`,
    description: post.summary,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  if (!post) notFound();
  const related = posts
    .filter(
      (item) => item.slug !== post.slug && item.category === post.category,
    )
    .slice(0, 2);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-8">
        <article className="mx-auto max-w-3xl py-10 sm:py-16">
          <Link
            href="/posts"
            className="link link-hover text-sm text-base-content/60"
          >
            ← 記事一覧へ戻る
          </Link>
          <header className="mt-8 border-b border-base-300/70 pb-8">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
              <Link
                className="link link-hover"
                href={categoryPath(post.category)}
              >
                {categoryLabel(post.category)}
              </Link>
              <span aria-hidden="true" className="text-base-content/40">
                /
              </span>
              <time dateTime={post.date} className="text-base-content/55">
                公開日：
                {new Intl.DateTimeFormat("ja-JP", { dateStyle: "long" }).format(
                  new Date(post.date),
                )}
              </time>
            </div>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-base-content/70">
              {post.summary}
            </p>
            <Image
              src={post.cover.src}
              alt=""
              width={post.cover.width}
              height={post.cover.height}
              priority
              className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover"
              sizes="(min-width: 768px) 48rem, 100vw"
            />
          </header>
          <div className="py-8 sm:py-12">
            <PostBody code={post.content} />
          </div>
          <ul
            aria-label="タグ"
            className="flex flex-wrap gap-2 border-t border-base-300/70 pt-6"
          >
            {post.tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={tagPath(tag)}
                  className="badge badge-outline min-h-8 px-3"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </article>
        {related.length > 0 && (
          <section className="mx-auto max-w-3xl border-t border-base-300/70 py-10">
            <h2 className="text-2xl font-semibold">関連記事</h2>
            <PostList posts={related} />
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
