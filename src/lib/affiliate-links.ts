/**
 * アフィリエイトリンク管理システム
 * - 全リンクを一箇所で管理
 * - rel="nofollow sponsored" 自動付与
 * - パラメータの一括変更対応
 */

export interface AffiliateLink {
  /** 管理用ID */
  id: string;
  /** ツール名 */
  name: string;
  /** アフィリエイトURL */
  url: string;
  /** 公式サイトURL（非アフィリエイト） */
  officialUrl: string;
  /** 表示テキスト */
  label: string;
  /** カテゴリ */
  category: "ai-chat" | "ai-image" | "ai-writing" | "ai-coding" | "ai-video" | "ai-audio" | "ai-productivity" | "other";
  /** メモ */
  note?: string;
}

export const AFFILIATE_LINKS: Record<string, AffiliateLink> = {
  chatgpt: {
    id: "chatgpt",
    name: "ChatGPT",
    url: "https://chat.openai.com/",
    officialUrl: "https://openai.com/chatgpt",
    label: "ChatGPTを試す",
    category: "ai-chat",
  },
  claude: {
    id: "claude",
    name: "Claude",
    url: "https://claude.ai/",
    officialUrl: "https://claude.ai/",
    label: "Claudeを試す",
    category: "ai-chat",
  },
  gemini: {
    id: "gemini",
    name: "Gemini",
    url: "https://gemini.google.com/",
    officialUrl: "https://gemini.google.com/",
    label: "Geminiを試す",
    category: "ai-chat",
  },
  midjourney: {
    id: "midjourney",
    name: "Midjourney",
    url: "https://www.midjourney.com/",
    officialUrl: "https://www.midjourney.com/",
    label: "Midjourneyを試す",
    category: "ai-image",
  },
  notion_ai: {
    id: "notion_ai",
    name: "Notion AI",
    url: "https://www.notion.so/product/ai",
    officialUrl: "https://www.notion.so/product/ai",
    label: "Notion AIを試す",
    category: "ai-productivity",
  },
  cursor: {
    id: "cursor",
    name: "Cursor",
    url: "https://cursor.sh/",
    officialUrl: "https://cursor.sh/",
    label: "Cursorを試す",
    category: "ai-coding",
  },
};

/**
 * IDからアフィリエイトリンクを取得
 */
export function getAffiliateLink(id: string): AffiliateLink | undefined {
  return AFFILIATE_LINKS[id];
}

/**
 * カテゴリでフィルタ
 */
export function getAffiliateLinksByCategory(
  category: AffiliateLink["category"]
): AffiliateLink[] {
  return Object.values(AFFILIATE_LINKS).filter((l) => l.category === category);
}
