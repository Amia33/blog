import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  categories,
  categoryLabel,
  publicPosts,
  tags,
  tagPath,
  categoryPath,
} from "@/lib/content/public-posts";

export default function Home() {
  const featured = publicPosts[0];
  const recent = publicPosts.slice(1, 4);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-8">
        <section className="grid gap-10 border-b border-base-300/70 py-14 sm:grid-cols-[1fr_17rem] sm:items-end sm:py-20">
          <div>
            <p className="text-xs tracking-[0.2em] text-primary">
              NOTES ON EVERYDAY LIFE
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              ことばの余白に、
              <br className="hidden sm:block" />
              日々を記す。
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-base-content/65 sm:text-lg">
              中文、にほんご、English。ひとつの言語に決めず、その日の気持ちに近いことばで書く小さな記録。
            </p>
            <Link
              href="/posts"
              className="btn btn-outline mt-7 rounded-full px-6"
            >
              記事一覧を見る
            </Link>
          </div>
          <aside className="border-l-2 border-primary/50 pl-5 text-sm leading-relaxed text-base-content/65">
            <h2 className="font-semibold text-base-content">
              この場所について
            </h2>
            <p className="mt-2">
              大きな結論より、小さな観察を。日常の断片と言語のあいだを行き来しています。
            </p>
            <Link href="/about" className="link link-hover mt-3 inline-block">
              About →
            </Link>
          </aside>
        </section>

        {featured && (
          <section className="grid gap-6 border-b border-base-300/70 py-10 sm:grid-cols-[0.7fr_1fr] sm:gap-12 sm:py-14">
            <div className="flex flex-col justify-center">
              <p className="text-xs tracking-[0.18em] text-base-content/55">
                LATEST NOTE
              </p>
              <h2 className="mt-3 text-2xl font-semibold leading-snug sm:text-4xl">
                <Link
                  href={`/posts/${featured.slug}`}
                  className="link link-hover"
                >
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-4 leading-relaxed text-base-content/70">
                {featured.summary}
              </p>
              <Link
                href={`/posts/${featured.slug}`}
                className="link link-hover mt-5 text-sm"
              >
                続きを読む →
              </Link>
            </div>
            <div className="rounded-2xl border border-base-300 bg-base-200 p-5 sm:p-8">
              <p className="text-xs tracking-[0.16em] text-base-content/55">
                BROWSE BY
              </p>
              <h3 className="mt-3 text-lg font-semibold">カテゴリー</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <li key={category}>
                    <Link
                      className="badge badge-outline min-h-8 px-3"
                      href={categoryPath(category)}
                    >
                      {categoryLabel(category)}
                    </Link>
                  </li>
                ))}
              </ul>
              <h3 className="mt-7 text-lg font-semibold">タグ</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {tags.slice(0, 8).map((tag) => (
                  <li key={tag}>
                    <Link
                      className="badge badge-ghost min-h-8 px-3"
                      href={tagPath(tag)}
                    >
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="py-10 sm:py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.18em] text-base-content/55">
                RECENT
              </p>
              <h2 className="mt-2 text-2xl font-semibold">最近の記事</h2>
            </div>
            <Link href="/posts" className="link link-hover text-sm">
              すべて見る →
            </Link>
          </div>
          <div className="mt-2">
            {recent.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
