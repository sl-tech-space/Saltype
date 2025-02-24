import { defineEventHandler, readBody, H3Event } from "h3";
import fs from "fs/promises";
import path from "path";
import { TextGenerateResponse, SentenceData } from "~/types/typing";

/**
 * 漢字を含むかどうかをチェック
 */
function containsKanji(str: string): boolean {
  return /[\u4E00-\u9FFF]/.test(str);
}

/**
 * 文章生成
 * @param event
 * @returns
 */
export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const sentencesPath = config.public.sentencesPath;
  const body = await readBody(event);
  const input: string = body.input;
  const count = body.count || 500;

  try {
    // レスポンスに型を指定
    const response = await $fetch<TextGenerateResponse>(
      `${config.public.serverSideBaseURL}/api/django/textgenerate/generate/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: input,
        }),
      }
    );

    // 生成された文章をJSONファイルに保存
    const aiTextPath = path.join(
      process.cwd(),
      sentencesPath,
      "japanese",
      "ai-text.json"
    );

    // 既存のai-text.jsonを削除
    try {
      await fs.unlink(aiTextPath);
    } catch {
      // ファイルが存在しない場合は無視
    }

    // ディレクトリが存在することを確認
    const dir = path.dirname(aiTextPath);
    await fs.mkdir(dir, { recursive: true });

    // 新規作成
    let existingData: SentenceData = { sentences: [] };

    // 新しい文章を追加（ひらがな部分に漢字を含まないものだけを追加）
    if (response.generatedPairs && response.generatedPairs.length > 0) {
      const filteredPairs = response.generatedPairs.filter(
        ([_, hiragana]) => !containsKanji(hiragana)
      );
      existingData.sentences.push(...filteredPairs);
    }

    // JSONファイルに書き込み
    await fs.writeFile(
      aiTextPath,
      JSON.stringify(existingData, null, 2),
      "utf-8"
    );

    // 生成された文章を返す
    let result: [string, string][] = [];
    const allSentences = existingData.sentences;

    while (result.length < count) {
      const remaining = count - result.length;
      const shuffled = [...allSentences].sort(() => Math.random() - 0.5);
      result = result.concat(shuffled.slice(0, remaining));
    }

    return result;
  } catch (error) {
    console.error("Error generating or saving sentences:", error);
    throw createError({
      statusCode: 500,
      message: "文章の生成または保存に失敗しました",
    });
  }
});
