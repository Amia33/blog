import type { Metadata } from "next";
import { Suspense } from "react";
import { ArchiveHeading } from "@/components/archive-heading";
import { PublicSearch } from "@/components/public-search";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { publicPosts } from "@/lib/content/public-posts";

export const metadata: Metadata = {
  title: "検索 | Amia",
  description: "公開記事を検索します。",
};

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-8"
      >
        <ArchiveHeading
          eyebrow="SEARCH"
          title="公開記事を探す"
          description="記事のタイトル、本文、カテゴリー、タグを検索できます。"
        />
        <Suspense fallback={<p className="py-8">検索を準備しています。</p>}>
          <PublicSearch posts={publicPosts} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
