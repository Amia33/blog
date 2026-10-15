import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "このブログについて | Amia",
  description: "Amia blog demo と、この場所で扱う記事について。",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-8">
        <article className="max-w-3xl py-12 sm:py-16">
          <p className="text-xs tracking-[0.18em] text-base-content/55">
            ABOUT
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            このブログについて
          </h1>
          <div className="prose-content mt-8">
            <p>
              Amia
              は、日常の断片と言語について書くブログの公開デモです。記事は日本語、中文、English
              を混ぜて書いています。
            </p>
            <h2>公開デモの内容</h2>
            <p>
              このリポジトリとサイトにある記事、画像、設定はすべて架空のサンプルです。個人情報や実際の下書きは含めません。
            </p>
            <h2>Q&A デモについて</h2>
            <p>
              一部のサンプル記事にある質問による表示解除は、動作例にすぎません。公開リポジトリ上のハッシュや本文は調査可能で、Q&A
              は本人確認や機密保護ではありません。秘密の情報には使用しないでください。
            </p>
          </div>
          <Link
            href="/posts"
            className="btn btn-outline mt-8 rounded-full px-6"
          >
            記事一覧を見る
          </Link>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
