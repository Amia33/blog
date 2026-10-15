import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveHeading } from "@/components/archive-heading";
import { PostList } from "@/components/post-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { publicPosts, tags } from "@/lib/content/public-posts";

type Props = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  if (!tags.includes(tag)) return {};
  return {
    title: `${tag} | Amia`,
    description: `「${tag}」タグの記事一覧。`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  if (!tags.includes(tag)) notFound();
  const filtered = publicPosts.filter((post) => post.tags.includes(tag));

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-8">
        <ArchiveHeading
          eyebrow="TAG"
          title={tag}
          description={`「${tag}」タグの記事。`}
        />
        <PostList posts={filtered} />
      </main>
      <SiteFooter />
    </div>
  );
}
