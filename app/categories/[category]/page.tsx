import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveHeading } from "@/components/archive-heading";
import { PostList } from "@/components/post-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  categories,
  categoryLabel,
  publicPosts,
} from "@/lib/content/public-posts";

type Props = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!categories.includes(category)) return {};
  return {
    title: `${categoryLabel(category)} | Amia`,
    description: `「${categoryLabel(category)}」カテゴリーの記事一覧。`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!categories.includes(category)) notFound();
  const filtered = publicPosts.filter((post) => post.category === category);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-8">
        <ArchiveHeading
          eyebrow="CATEGORY"
          title={categoryLabel(category)}
          description={`「${categoryLabel(category)}」カテゴリーの記事。`}
        />
        <PostList posts={filtered} />
      </main>
      <SiteFooter />
    </div>
  );
}
