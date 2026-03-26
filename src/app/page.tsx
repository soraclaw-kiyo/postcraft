"use client";

import { useState } from "react";

const INDUSTRIES = [
  "飲食店",
  "美容・サロン",
  "小売・ショップ",
  "サービス業",
  "EC・通販",
  "フリーランス",
  "その他",
];

const PLATFORMS = [
  { id: "X", label: "X (Twitter)" },
  { id: "Instagram", label: "Instagram" },
  { id: "TikTok", label: "TikTok" },
];

interface GenerateResult {
  posts: string[];
  hashtags: string[];
}

export default function Home() {
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [message, setMessage] = useState("");
  const [platform, setPlatform] = useState("X");
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!message.trim()) {
      setError("伝えたいことを入力してください");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, message, platform }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "生成に失敗しました");
      }

      const data: GenerateResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toneLabels = ["カジュアル", "プロフェッショナル", "ストーリー風"];

  return (
    <main className="min-h-screen px-4 py-8 md:py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            PostCraft <span className="text-accent">✦</span>
          </h1>
          <p className="mt-2 text-text-secondary">
            AI SNS投稿文ジェネレーター
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6 rounded-2xl border border-border bg-bg-secondary p-6 md:p-8">
          {/* Industry */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-secondary">
              業種
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-3 text-text-primary outline-none transition focus:border-accent"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-secondary">
              伝えたいこと
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="例: 新メニューのアボカドバーガーが登場！期間限定で20%OFF"
              rows={3}
              className="w-full resize-none rounded-lg border border-border bg-bg-tertiary px-4 py-3 text-text-primary placeholder-text-secondary/50 outline-none transition focus:border-accent"
            />
          </div>

          {/* Platform */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-secondary">
              プラットフォーム
            </label>
            <div className="flex gap-3">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                    platform === p.id
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-bg-tertiary text-text-secondary hover:border-accent/50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-lg bg-accent py-3.5 text-base font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                生成中...
              </span>
            ) : (
              "✨ 投稿文を生成"
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-4">
            {result.posts.map((post, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-bg-secondary p-6"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-accent">
                    パターン{i + 1}：{toneLabels[i]}
                  </span>
                  <button
                    onClick={() => handleCopy(post, i)}
                    className="rounded-md border border-border px-3 py-1 text-xs text-text-secondary transition hover:border-accent hover:text-accent"
                  >
                    {copiedIndex === i ? "✓ コピー済み" : "コピー"}
                  </button>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed text-text-primary">
                  {post}
                </p>
              </div>
            ))}

            {/* Hashtags */}
            <div className="rounded-2xl border border-border bg-bg-secondary p-6">
              <span className="mb-3 block text-sm font-medium text-accent">
                推奨ハッシュタグ
              </span>
              <div className="flex flex-wrap gap-2">
                {result.hashtags.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => navigator.clipboard.writeText(tag)}
                    className="rounded-full border border-border bg-bg-tertiary px-3 py-1 text-sm text-text-secondary transition hover:border-accent hover:text-accent"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="mt-12 text-center text-xs text-text-secondary/50">
          Powered by SoraClaw
        </p>
      </div>
    </main>
  );
}
