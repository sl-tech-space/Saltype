import { defineEventHandler, readBody, H3Event } from "h3";
import { TextGenerateResponse } from "~/types/typing";

/**
 * 漢字を含むかどうかをチェック
 */
function containsKanji(str: string): boolean {
  return /[\u4E00-\u9FFF]/.test(str);
}

/**
 * 文章生成API
 * @param event
 * @returns 生成された文章の配列
 */
export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const input: string = body.input;
  const user_id: string = body.user_id;
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
          user_id: user_id,
        })
      }
    );

    // 新しい文章を追加（ひらがな部分に漢字を含まないものだけを追加）
    let sentences: [string, string][] = [];
    if (response.generatedPairs && response.generatedPairs.length > 0) {
      sentences = response.generatedPairs.filter(
        ([_, hiragana]) => !containsKanji(hiragana)
      );
    }

    // 生成された文章を返す
    let result: [string, string][] = [];
    while (result.length < count) {
      const remaining = count - result.length;
      const shuffled = [...sentences].sort(() => Math.random() - 0.5);
      result = result.concat(shuffled.slice(0, remaining));
    }

    return result;
  } catch (error) {
    console.error("Error generating sentences:", error);
    throw createError({
      statusCode: 500,
      message: "文章の生成に失敗しました",
    });
  }
});
