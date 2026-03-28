import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-data";
import { SITE_CONFIG } from "@/lib/site-config";

const CATEGORIES = [
  { emoji: "💬", name: "AIチャット", description: "ChatGPT・Claude・Geminiなど" },
  { emoji: "🎨", name: "AI画像生成", description: "Midjourney・DALL-E・Stable Diffusion" },
  { emoji: "💻", name: "AIコーディング", description: "Cursor・GitHub Copilotなど" },
  { emoji: "✍️", name: "AIライティング", description: "Notion AI・Jasperなど" },
  { emoji: "📊", name: "AI比較", description: "ツール同士の徹底比較記事" },
];

export default function Home() {
  const latestPosts = BLOG_POSTS.slice(0, 6);
  const reviewPosts = BLOG_POSTS.filter((p) => p.type === "review").slice(0, 3);
  const comparisonPosts = BLOG_POSTS.filter((p) => p.type === "comparison").slice(0, 3);

  return (
    <>
      {/* ━━━ HERO ━━━ */}
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[640px] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]"
        />

        <span className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/8 px-4 py-1.5 text-xs font-medium tracking-wide text-accent">
          <span>🤖</span>
          AIツールを実際に使って本音レビュー
        </span>

        <h1 className="relative text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl md:text-6xl">
          AIツール、
          <br />
          <span className="bg-gradient-to-r from-accent via-purple-400 to-accent bg-clip-text text-transparent">
            どれを選ぶ？
          </span>
        </h1>

        <p className="relative mt-5 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
          ChatGPT・Claude・Geminiなど話題のAIツールを
          <br className="hidden sm:block" />
          <strong className="text-text-primary">非エンジニアにもわかりやすく</strong>
          比較・解説。
          <br className="hidden sm:block" />
          あなたにぴったりのAIツールが見つかります。
        </p>

        <div className="relative mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-hover hover:shadow-accent/35 active:scale-[0.98]"
          >
            📖 レビュー記事を読む
          </Link>
          <Link
            href="/blog?type=comparison"
            className="inline-flex items-center gap-1 rounded-xl border border-border px-6 py-4 text-sm font-medium text-text-secondary transition hover:border-accent/50 hover:text-accent"
          >
            ⚖️ AIツール比較を見る
          </Link>
        </div>
      </section>

      {/* ━━━ CATEGORIES ━━━ */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="mb-4 text-center text-2xl font-bold tracking-tight sm:text-3xl">
          <span className="text-accent">カテゴリ</span>から探す
        </h2>
        <p className="mb-10 text-center text-text-secondary">
          気になるジャンルのAIツールレビューをチェック
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/blog?category=${encodeURIComponent(cat.name)}`}
              className="group rounded-2xl border border-border bg-bg-secondary p-5 transition hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <h3 className="mt-3 text-lg font-bold text-text-primary transition group-hover:text-accent">
                {cat.name}
              </h3>
              <p className="mt-1 text-sm text-text-secondary">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ━━━ LATEST REVIEWS ━━━ */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="mb-4 text-center text-2xl font-bold tracking-tight sm:text-3xl">
          最新<span className="text-accent">レビュー</span>
        </h2>
        <p className="mb-10 text-center text-text-secondary">
          実際に使って書いた本音レビュー
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-border bg-bg-secondary p-6 transition hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  {post.category}
                </span>
                <span className="text-xs text-text-secondary">{post.readTime}</span>
              </div>
              <h3 className="mt-3 text-base font-bold text-text-primary transition group-hover:text-accent line-clamp-2">
                {post.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary line-clamp-2">
                {post.description}
              </p>
              {post.reviewMeta && (
                <div className="mt-3 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${
                        post.reviewMeta!.rating >= star ? "text-yellow-400" : "text-border"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-1 text-sm font-medium text-text-secondary">
                    {post.reviewMeta.rating}
                  </span>
                </div>
              )}
              <p className="mt-2 text-xs text-text-secondary/60">{post.date}</p>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-text-secondary transition hover:border-accent/50 hover:text-accent"
          >
            すべての記事を見る →
          </Link>
        </div>
      </section>

      {/* ━━━ ABOUT ━━━ */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {SITE_CONFIG.nameJa}について
        </h2>
        <p className="mt-4 text-text-secondary leading-7">
          {SITE_CONFIG.nameJa}は、AIツールを実際に使って検証し、
          非エンジニアにもわかりやすく解説するレビューブログです。
          <br />
          「結局どれがいいの？」に本音で答えます。
        </p>
      </section>
    </>
  );
}
