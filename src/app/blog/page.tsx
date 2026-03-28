import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS, getAllCategories } from "@/lib/blog-data";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "AIツールレビュー記事一覧",
  description:
    "ChatGPT・Claude・Gemini・Midjourney等、話題のAIツールを実際に使って本音レビュー。比較記事・使い方ガイドも。",
  alternates: {
    canonical: `${SITE_CONFIG.url}/blog`,
  },
};

export default function BlogIndex() {
  const categories = getAllCategories();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          AIツール<span className="text-accent">レビュー</span>
        </h1>
        <p className="mt-3 text-text-secondary">
          実際に使って書いた本音レビュー・比較・使い方ガイド
        </p>
      </div>

      {/* Category filter */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <Link
          href="/blog"
          className="rounded-full border border-accent bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/20"
        >
          すべて
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/blog?category=${encodeURIComponent(cat)}`}
            className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-text-secondary transition hover:border-accent/50 hover:text-accent"
          >
            {cat}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-2xl border border-border bg-bg-secondary p-6 transition hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
          >
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                {post.category}
              </span>
              <span className="rounded-full border border-border px-2 py-0.5 text-xs text-text-secondary">
                {post.type === "review" ? "レビュー" : post.type === "comparison" ? "比較" : post.type === "howto" ? "使い方" : "ニュース"}
              </span>
              <span className="text-xs text-text-secondary">{post.readTime}</span>
            </div>
            <h2 className="mt-3 text-lg font-bold text-text-primary transition group-hover:text-accent line-clamp-2">
              {post.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary line-clamp-3">
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
            <p className="mt-3 text-xs text-text-secondary/60">{post.date}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
