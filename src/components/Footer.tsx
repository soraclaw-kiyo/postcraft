import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site-config";

const CATEGORY_LINKS = [
  { label: "AIチャット", href: "/blog?category=AIチャット" },
  { label: "AI比較", href: "/blog?category=AI比較" },
  { label: "AI画像生成", href: "/blog?category=AI画像生成" },
];

const POPULAR_LINKS = [
  { label: "ChatGPTレビュー", href: "/blog/chatgpt-review-2026" },
  { label: "Claude vs ChatGPT比較", href: "/blog/claude-vs-chatgpt-comparison-2026" },
  { label: "AI画像生成ツール5選", href: "/blog/ai-image-generation-tools-2026" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-bg-secondary">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="text-lg font-bold">
              <span className="text-accent">🤖</span> {SITE_CONFIG.nameJa}
            </Link>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">カテゴリ</h3>
            <ul className="space-y-2">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">人気記事</h3>
            <ul className="space-y-2">
              {POPULAR_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">リンク</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-text-secondary transition hover:text-accent"
                >
                  すべての記事
                </Link>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.authorUrl}
                  className="text-sm text-text-secondary transition hover:text-accent"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SITE_CONFIG.author}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/50 pt-6 text-center text-xs text-text-secondary/50">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.nameJa} by{" "}
            <a
              href={SITE_CONFIG.authorUrl}
              className="underline transition hover:text-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              {SITE_CONFIG.author}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
