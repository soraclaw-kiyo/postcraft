import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { industry, message, platform } = await req.json();

    if (!industry || !message || !platform) {
      return NextResponse.json(
        { error: "必須パラメータが不足しています" },
        { status: 400 }
      );
    }

    const prompt = `あなたは日本のSNSマーケティングの専門家です。
業種「${industry}」の事業者が「${message}」を${platform}で発信したいです。
以下のルールで3パターンの投稿文を生成してください:
- ${platform}の文化・文字数制限に最適化
- 日本語で自然な口調
- エンゲージメントが取れる構成（フック→内容→CTA）
- 絵文字を適度に使用
- 各パターンは異なるトーン（①カジュアル ②プロフェッショナル ③ストーリー風）
また、関連ハッシュタグを5-8個提案してください。

必ず以下のJSON形式で回答してください（他のテキストは含めないでください）:
{
  "posts": ["パターン1の投稿文", "パターン2の投稿文", "パターン3の投稿文"],
  "hashtags": ["#タグ1", "#タグ2", "#タグ3", "#タグ4", "#タグ5"]
}`;

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "あなたはSNSマーケティングの専門家です。指示通りのJSON形式で回答してください。JSONのみを出力し、マークダウンのコードブロックや他のテキストは含めないでください。",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "AIからの応答が空でした" },
        { status: 500 }
      );
    }

    // Clean potential markdown code blocks
    const cleaned = content
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!parsed.posts || !Array.isArray(parsed.posts) || parsed.posts.length < 3) {
      return NextResponse.json(
        { error: "AIの応答形式が不正です" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      posts: parsed.posts.slice(0, 3),
      hashtags: parsed.hashtags || [],
    });
  } catch (err) {
    console.error("Generate error:", err);
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: "AIの応答をパースできませんでした。再試行してください。" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "生成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
