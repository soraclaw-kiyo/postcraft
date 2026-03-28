import { SITE_CONFIG } from "./site-config";
import type { BlogPost } from "./blog-data";

/**
 * 構造化データ（JSON-LD）生成ユーティリティ
 */

export function generateArticleJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updatedDate || post.date,
    author: {
      "@type": "Organization",
      name: SITE_CONFIG.author,
      url: SITE_CONFIG.authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.nameJa,
      url: SITE_CONFIG.url,
    },
    mainEntityOfPage: `${SITE_CONFIG.url}/blog/${post.slug}`,
    image: post.thumbnail || `${SITE_CONFIG.url}/og-default.png`,
    inLanguage: "ja",
  };
}

export function generateFAQJsonLd(faq: { question: string; answer: string }[]) {
  if (faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateReviewJsonLd(post: BlogPost) {
  if (!post.reviewMeta) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: post.reviewMeta.toolName,
      applicationCategory: "AIApplication",
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: post.reviewMeta.rating,
      bestRating: 5,
    },
    author: {
      "@type": "Organization",
      name: SITE_CONFIG.author,
    },
    reviewBody: post.description,
    datePublished: post.date,
  };
}

export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.nameJa,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    inLanguage: "ja",
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.author,
      url: SITE_CONFIG.authorUrl,
    },
  };
}
