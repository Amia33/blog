import Link from "next/link";

const navigation = [
  { href: "/posts", label: "記事一覧" },
  { href: "/about", label: "このブログについて" },
  { href: "/search", label: "検索" },
];

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
        <nav aria-label="メインナビゲーション" className="ml-auto">
          <ul className="menu menu-horizontal gap-1 p-0 text-sm">
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
