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
  count: number = 300
) {
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
      });

      if (!response.ok) {
        throw new Error(`サーバーエラー`);
      }

      const data = await response.json();

      return data;
    } catch (e) {
      console.error("ネットワークエラーまたはその他例外が発生しました");
      return null;
    }
  };

  return {
    sentences,
  };
}
