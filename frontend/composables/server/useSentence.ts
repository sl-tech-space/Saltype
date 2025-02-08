/**
 * 文章を返す処理
 * @param language
 * @param difficultyLevel
 * @param count
 * @returns sentences
 */
export function useSentence(
  languageCode: string,
  difficultyLevelCode: string,
  count: number = 500
): { sentences: () => Promise<Array<[string, string]>> } {
  const convertedLanguage = convertNumberToEnglishLanguageName(languageCode);
  const convertedDifficultyLevel =
    convertNumberToEnglishDifficultyLevelName(difficultyLevelCode);

  const sentences = async () => {
    try {
      const response = await fetch("/api/nuxt/random-sentences/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: convertedLanguage,
          difficultyLevel: convertedDifficultyLevel,
          count: count,
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`サーバーエラー`);
      }

      const data = await response.json();

      return data;
    } catch {
      throw new Error("ネットワークエラーまたはその他例外が発生しました");
    }
  };

  return {
    sentences,
  };
}
