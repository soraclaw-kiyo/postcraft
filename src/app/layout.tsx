import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PostCraft - AI SNS投稿文ジェネレーター",
  description: "AIで魅力的なSNS投稿文を3秒で生成。日本語特化。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
