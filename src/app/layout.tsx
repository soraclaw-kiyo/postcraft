import type { Metadata } from "next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_CONFIG } from "@/lib/site-config";
import { generateWebSiteJsonLd } from "@/lib/structured-data";
import "./globals.css";

const TITLE = `${SITE_CONFIG.nameJa} - AIツールを本音レビュー｜比較・使い方・料金まとめ`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: TITLE,
    template: `%s | ${SITE_CONFIG.nameJa}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "AIツール レビュー",
    "AIツール 比較",
    "ChatGPT レビュー",
    "Claude 使い方",
    "Gemini 比較",
    "AI画像生成",
    "AIツール おすすめ",
    "AI 無料",
    "AIツール 日本語",
    "ChatGPT 料金",
  ],
  authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.authorUrl }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.author,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.nameJa,
    title: TITLE,
    description: SITE_CONFIG.description,
    images: [
      {
        url: `${SITE_CONFIG.url}/og-default.png`,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.nameJa,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.url}/og-default.png`],
    creator: SITE_CONFIG.twitterHandle,
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  category: "technology",
};

const websiteJsonLd = generateWebSiteJsonLd();

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_CONFIG.author,
  url: SITE_CONFIG.authorUrl,
  logo: `${SITE_CONFIG.url}/logo.png`,
  sameAs: [`https://x.com/soraclaw`],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <GoogleAnalytics />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
