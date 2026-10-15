import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-base-300/70">
      <div className="navbar mx-auto max-w-6xl px-5 sm:px-8">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          Amia
          <span className="ml-2 text-sm font-normal text-base-content/60">
            日々の記録
          </span>
        </Link>
        <nav
          aria-label="メインナビゲーション"
          className="ml-auto flex items-center gap-6 text-sm"
        >
          <Link href="/" className="link link-hover">
            記事一覧
          </Link>
          <a href="#about" className="link link-hover">
            このブログについて
          </a>
        </nav>
      </div>
    </header>
  );
}
