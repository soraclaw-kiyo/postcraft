interface PriceRow {
  plan: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

interface PriceTableProps {
  rows: PriceRow[];
}

/**
 * 料金比較テーブルコンポーネント
 */
export default function PriceTable({ rows }: PriceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-3 pr-4 text-text-secondary font-medium">プラン</th>
            <th className="pb-3 pr-4 text-text-secondary font-medium">料金</th>
            <th className="pb-3 text-text-secondary font-medium">主な機能</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.plan}
              className={`border-b border-border/50 ${
                row.recommended ? "bg-accent/5" : ""
              }`}
            >
              <td className="py-4 pr-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text-primary">{row.plan}</span>
                  {row.recommended && (
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                      おすすめ
                    </span>
                  )}
                </div>
              </td>
              <td className="py-4 pr-4 font-medium text-text-primary">{row.price}</td>
              <td className="py-4">
                <ul className="space-y-1">
                  {row.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-text-secondary">
                      <span className="text-accent">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
