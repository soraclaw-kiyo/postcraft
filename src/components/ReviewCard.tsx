import AffiliateLink from "./AffiliateLink";

interface ReviewCardProps {
  toolName: string;
  rating: number;
  priceFree: string;
  pricePaid: string;
  affiliateId?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <svg
            key={star}
            className={`h-5 w-5 ${filled ? "text-yellow-400" : half ? "text-yellow-400/50" : "text-border"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
      <span className="ml-2 text-lg font-bold text-text-primary">{rating}</span>
      <span className="text-sm text-text-secondary">/ 5.0</span>
    </div>
  );
}

/**
 * AIツールレビュー用の評価カード
 */
export default function ReviewCard({
  toolName,
  rating,
  priceFree,
  pricePaid,
  affiliateId,
}: ReviewCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-bg-secondary p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-text-primary">{toolName}</h3>
        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          レビュー
        </span>
      </div>

      <div className="mb-4">
        <p className="mb-1 text-sm text-text-secondary">総合評価</p>
        <StarRating rating={rating} />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-bg-tertiary p-3">
          <p className="text-xs text-text-secondary">無料プラン</p>
          <p className="mt-1 text-sm font-medium text-text-primary">{priceFree}</p>
        </div>
        <div className="rounded-lg bg-bg-tertiary p-3">
          <p className="text-xs text-text-secondary">有料プラン</p>
          <p className="mt-1 text-sm font-medium text-text-primary">{pricePaid}</p>
        </div>
      </div>

      {affiliateId && (
        <AffiliateLink id={affiliateId} variant="button" className="w-full justify-center" />
      )}
    </div>
  );
}
