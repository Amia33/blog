import Link from "next/link";

const navigation = [
  { href: "/posts", label: "記事一覧" },
  { href: "/about", label: "このブログについて" },
  { href: "/search", label: "検索" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-base-300/70">
      <Link
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-field focus:bg-base-100 focus:px-4 focus:py-3 focus:text-base-content focus:outline-2 focus:outline-offset-2 focus:outline-primary"
      >
        本文へスキップ
      </Link>
      <div className="navbar mx-auto flex-col items-start gap-2 px-5 py-3 sm:flex-row sm:items-center sm:px-8">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          Amia
          <span className="ml-2 text-sm font-normal text-base-content/60">
            日々の記録
          </span>
        </Link>
        <nav
          aria-label="メインナビゲーション"
          className="w-full sm:ml-auto sm:w-auto"
        >
          <ul className="menu menu-horizontal flex-wrap gap-1 p-0 text-sm">
            {navigation.map(({ href, label }) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
