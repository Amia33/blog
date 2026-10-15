import Link from "next/link";
import { posts } from "@/.velite";
import { PostCard } from "@/components/post-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const sortedPosts = [...posts].sort((first, second) =>
  second.date.localeCompare(first.date),
);

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-8">
        <section className="grid gap-8 border-b border-base-300/70 py-16 sm:grid-cols-[1fr_18rem] sm:items-end sm:py-24">
          <div>
            <p className="text-sm tracking-[0.2em] text-primary">
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
              href="#posts"
              className="btn btn-outline mt-7 rounded-full px-6"
            >
              記事を読む
              <span aria-hidden="true">↓</span>
            </Link>
          </div>
          <div
            id="about"
            className="border-l-2 border-primary/50 pl-5 text-sm leading-relaxed text-base-content/65"
          >
            <p className="font-semibold text-base-content">この場所について</p>
            <p className="mt-2">
              大きな結論より、小さな観察を。日常の断片と言語のあいだを行き来しています。
            </p>
          </div>
        </section>

        <section id="posts" className="py-12 sm:py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.18em] text-base-content/55">
                ARCHIVE
              </p>
              <h2 className="mt-2 text-2xl font-semibold">記事一覧</h2>
            </div>
            <p className="text-sm text-base-content/55">{posts.length} 件</p>
          </div>
          <div className="mt-3">
            {sortedPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
