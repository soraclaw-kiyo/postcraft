interface ProsConsProps {
  pros: string[];
  cons: string[];
}

/**
 * メリット・デメリットコンポーネント
 */
export default function ProsCons({ pros, cons }: ProsConsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* メリット */}
      <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-green-400">
          <span>👍</span>
          メリット
        </h3>
        <ul className="space-y-2">
          {pros.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-6 text-text-secondary">
              <span className="mt-0.5 text-green-400">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* デメリット */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-red-400">
          <span>👎</span>
          デメリット
        </h3>
        <ul className="space-y-2">
          {cons.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-6 text-text-secondary">
              <span className="mt-0.5 text-red-400">✗</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
