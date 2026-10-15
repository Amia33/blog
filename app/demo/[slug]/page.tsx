import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { DemoUnlock } from "@/components/demo-unlock";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDemoPost } from "@/lib/demo-gate.server";

type Props = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "Q&A demo | Amia",
  description: "Fictional Q&A gate demonstration; not confidential.",
  robots: { index: false, follow: false },
};

export default function DemoPostPage({ params }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-8">
        <Suspense
          fallback={
            <p className="mx-auto max-w-3xl py-12">
              サンプル記事を読み込んでいます。
            </p>
          }
        >
          <DemoPostContent params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}

async function DemoPostContent({ params }: Props) {
  await connection();
  const { slug } = await params;
  const post = await getDemoPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl py-12 sm:py-16">
      <p className="badge badge-warning badge-outline">Q&A gate demo</p>
      <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 leading-relaxed text-base-content/70">
        {post.question}
      </p>
      <p className="mt-5 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm leading-relaxed">
        この公開デモの質問解除は機密保護ではありません。答えのハッシュと架空の本文は公開リポジトリから確認できます。実際の秘密や個人情報は入力しないでください。
      </p>
      <DemoUnlock slug={slug} />
    </article>
  );
}
