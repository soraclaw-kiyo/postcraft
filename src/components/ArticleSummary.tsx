interface ArticleSummaryProps {
  items: string[];
}

/**
 * 「この記事でわかること」サマリーコンポーネント
 * AEO最適化：検索エンジンが記事の要点を把握しやすくなる
 */
export default function ArticleSummary({ items }: ArticleSummaryProps) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-accent">
        <span>📌</span>
        この記事でわかること
      </h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm leading-6 text-text-secondary">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
              {i + 1}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
