import type { Metadata } from "next";
import { ArchiveHeading } from "@/components/archive-heading";
import { PostList } from "@/components/post-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { publicPosts } from "@/lib/content/public-posts";

export const metadata: Metadata = {
  title: "記事一覧 | Amia",
  description: "日々の観察と言語についての公開記事一覧。",
};

export default function PostsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-8">
        <ArchiveHeading
          eyebrow="ARCHIVE"
          title="記事一覧"
          description="日々の小さな記録を、新しいものから並べています。"
        />
        <p className="pt-8 text-sm text-base-content/55">
          {publicPosts.length} 件
        </p>
        <PostList posts={publicPosts} />
      </main>
      <SiteFooter />
    </div>
  );
}
