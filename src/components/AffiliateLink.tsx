import { getAffiliateLink } from "@/lib/affiliate-links";

interface AffiliateLinkProps {
  /** アフィリエイトリンクID */
  id: string;
  /** カスタムラベル（省略時はデフォルトラベル） */
  label?: string;
  /** ボタンスタイルで表示 */
  variant?: "inline" | "button" | "card";
  /** カスタムクラス */
  className?: string;
}

/**
 * アフィリエイトリンクコンポーネント
 * - rel="nofollow sponsored" 自動付与
 * - target="_blank" 自動付与
 */
export default function AffiliateLink({
  id,
  label,
  variant = "inline",
  className = "",
}: AffiliateLinkProps) {
  const link = getAffiliateLink(id);
  if (!link) return null;

  const displayLabel = label || link.label;

  if (variant === "button") {
    return (
      <a
        href={link.url}
        rel="nofollow sponsored noopener"
        target="_blank"
        className={`inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover ${className}`}
      >
        {displayLabel}
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    );
  }

  if (variant === "card") {
    return (
      <div className={`rounded-2xl border border-accent/30 bg-accent/5 p-5 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-accent">{link.name}</p>
            <p className="mt-1 text-xs text-text-secondary">
              {link.category === "ai-chat" ? "AIチャット" :
               link.category === "ai-image" ? "AI画像生成" :
               link.category === "ai-coding" ? "AIコーディング" :
               link.category === "ai-productivity" ? "AI生産性向上" : "AIツール"}
            </p>
          </div>
          <a
            href={link.url}
            rel="nofollow sponsored noopener"
            target="_blank"
            className="inline-flex items-center gap-1 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            {displayLabel}
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  // inline
  return (
    <a
      href={link.url}
      rel="nofollow sponsored noopener"
      target="_blank"
      className={`text-accent underline decoration-accent/30 underline-offset-2 transition hover:decoration-accent ${className}`}
    >
      {displayLabel}
    </a>
  );
}
