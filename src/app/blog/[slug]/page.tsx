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
      images: [post.thumbnail || `${SITE_CONFIG.url}/og-default.png`],
      creator: SITE_CONFIG.twitterHandle,
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

  const renderInline = (text: string) => {
    // Process bold, inline code, and links
    const tokens: React.ReactNode[] = [];
    const regex = /\*\*(.*?)\*\*|`(.*?)`|\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;
    let key = 0;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push(text.slice(lastIndex, match.index));
      }
      if (match[1] !== undefined) {
        tokens.push(
          <strong key={key++} className="text-text-primary font-semibold">
            {match[1]}
          </strong>
        );
      } else if (match[2] !== undefined) {
        tokens.push(
          <code key={key++} className="rounded bg-bg-tertiary px-1.5 py-0.5 text-sm font-mono text-accent">
            {match[2]}
          </code>
        );
      } else if (match[3] !== undefined) {
        tokens.push(
          <a
            key={key++}
            href={match[4]}
            className="text-accent underline underline-offset-2 hover:text-accent/80 transition"
            target={match[4].startsWith("http") ? "_blank" : undefined}
            rel={match[4].startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {match[3]}
          </a>
        );
      }
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      tokens.push(text.slice(lastIndex));
    }
    return tokens.length > 0 ? tokens : [text];
  };

  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      // Code blocks
      if (line.startsWith("```")) {
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        elements.push(
          <pre key={`code-${i}`} className="my-4 overflow-x-auto rounded-lg bg-bg-tertiary p-4 text-sm">
            <code className="text-text-secondary font-mono">{codeLines.join("\n")}</code>
          </pre>
        );
        continue;
      }

      // Headings
      if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={i}
            id={line.slice(3).replace(/\s+/g, "-").toLowerCase()}
            className="mb-4 mt-10 text-xl font-bold text-text-primary sm:text-2xl"
          >
            {line.slice(3)}
          </h2>
        );
        i++;
        continue;
      }
      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="mb-3 mt-8 text-lg font-bold text-text-primary">
            {line.slice(4)}
          </h3>
        );
        i++;
        continue;
      }

      // Unordered list items (collect consecutive)
      if (line.startsWith("- ")) {
        const items: React.ReactNode[] = [];
        while (i < lines.length && lines[i].startsWith("- ")) {
          items.push(
            <li key={i} className="text-text-secondary">
              {renderInline(lines[i].slice(2))}
            </li>
          );
          i++;
        }
        elements.push(
          <ul key={`ul-${i}`} className="my-2 ml-6 list-disc space-y-1">
            {items}
          </ul>
        );
        continue;
      }

      // Ordered list items (collect consecutive)
      if (/^\d+\.\s/.test(line)) {
        const items: React.ReactNode[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          items.push(
            <li key={i} className="text-text-secondary">
              {renderInline(lines[i].replace(/^\d+\.\s/, ""))}
            </li>
          );
          i++;
        }
        elements.push(
          <ol key={`ol-${i}`} className="my-2 ml-6 list-decimal space-y-1">
            {items}
          </ol>
        );
        continue;
      }

      // Table rows (collect consecutive)
      if (line.startsWith("| ")) {
        const rows: string[][] = [];
        while (i < lines.length && lines[i].startsWith("| ")) {
          const cells = lines[i].split("|").filter((c) => c.trim() !== "");
          // Skip separator rows like |---|---|
          if (!/^[\s-:]+$/.test(cells.join(""))) {
            rows.push(cells.map((c) => c.trim()));
          }
          i++;
        }
        if (rows.length > 0) {
          const [header, ...body] = rows;
          elements.push(
            <div key={`table-${i}`} className="my-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {header.map((cell, ci) => (
                      <th key={ci} className="px-3 py-2 text-left font-semibold text-text-primary">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((row, ri) => (
                    <tr key={ri} className="border-b border-border/50">
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-3 py-2 text-text-secondary">
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }

      // Empty line
      if (line.trim() === "") {
        elements.push(<br key={i} />);
        i++;
        continue;
      }

      // Regular paragraph with inline formatting
      elements.push(
        <p key={i} className="leading-8 text-text-secondary">
          {renderInline(line)}
        </p>
      );
      i++;
    }
    return elements;
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
