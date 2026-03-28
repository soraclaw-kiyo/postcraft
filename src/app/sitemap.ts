import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-data";
import { SITE_CONFIG } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_CONFIG.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_CONFIG.url}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_CONFIG.url}/blog/${post.slug}`,
    lastModified: new Date(post.updatedDate || post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages];
}
