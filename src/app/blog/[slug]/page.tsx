import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-data";
import { SITE_CONFIG } from "@/lib/site-config";
import {
  generateArticleJsonLd,
  generateFAQJsonLd,
  generateBreadcrumbJsonLd,
  generateReviewJsonLd,
} from "@/lib/structured-data";
import ArticleSummary from "@/components/ArticleSummary";
import ReviewCard from "@/components/ReviewCard";
import FAQ from "@/components/FAQ";

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${SITE_CONFIG.url}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedDate || post.date,
      authors: [SITE_CONFIG.author],
      tags: post.tags,
      images: [
        {
          url: post.thumbnail || `${SITE_CONFIG.url}/og-default.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const articleJsonLd = generateArticleJsonLd(post);
  const faqJsonLd = generateFAQJsonLd(post.faq);
  const reviewJsonLd = generateReviewJsonLd(post);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "ホーム", url: SITE_CONFIG.url },
    { name: "ブログ", url: `${SITE_CONFIG.url}/blog` },
    { name: post.title, url: `${SITE_CONFIG.url}/blog/${post.slug}` },
  ]);

  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("## ")) {
        return (
          <h2
            key={i}
            id={line.slice(3).replace(/\s+/g, "-").toLowerCase()}
            className="mb-4 mt-10 text-xl font-bold text-text-primary sm:text-2xl"
          >
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={i} className="mb-3 mt-8 text-lg font-bold text-text-primary">
            {line.slice(4)}
          </h3>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li key={i} className="ml-4 list-disc text-text-secondary">
            {line.slice(2)}
          </li>
        );
      }
      if (line.startsWith("```")) return null;
      if (line.startsWith("| ")) {
        return (
          <p key={i} className="text-sm text-text-secondary font-mono">
            {line}
          </p>
        );
      }
      if (line.trim() === "") return <br key={i} />;
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="leading-8 text-text-secondary">
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="text-text-primary font-semibold">
                {part}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });
  };

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug)
    .filter((p) => p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {reviewJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-text-secondary">
          <Link href="/" className="transition hover:text-accent">
            ホーム
          </Link>
          <span>/</span>
          <Link href="/blog" className="transition hover:text-accent">
            ブログ
          </Link>
          <span>/</span>
          <span className="truncate text-text-primary">{post.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {post.category}
            </span>
            <span className="rounded-full border border-border px-2 py-0.5 text-xs text-text-secondary">
              {post.type === "review" ? "レビュー" : post.type === "comparison" ? "比較" : "使い方"}
            </span>
            <span className="text-xs text-text-secondary">{post.readTime}で読める</span>
            <span className="text-xs text-text-secondary">{post.date}</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-text-secondary">{post.description}</p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-bg-tertiary px-3 py-1 text-xs text-text-secondary"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Summary: この記事でわかること */}
        <ArticleSummary items={post.summary} />

        {/* Review Card (レビュー記事のみ) */}
        {post.reviewMeta && (
          <div className="mt-8">
            <ReviewCard {...post.reviewMeta} />
          </div>
        )}

        {/* Content */}
        <article className="mt-10">{renderContent(post.content)}</article>

        {/* FAQ */}
        <FAQ items={post.faq} />

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h3 className="mb-4 text-lg font-bold">関連記事</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group rounded-xl border border-border bg-bg-secondary p-4 transition hover:border-accent/40"
                >
                  <span className="text-xs font-medium text-accent">{p.category}</span>
                  <h4 className="mt-1 text-sm font-bold text-text-primary transition group-hover:text-accent line-clamp-2">
                    {p.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
