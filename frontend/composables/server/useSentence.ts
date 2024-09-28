/**
 * 受け渡した文字の変換
 * 数字 → 文字
 * @param language 
 * @returns languageMap[language.toLowerCase()] || language
 */
function _convertLanguage(language: string): string {
  const languageMap: { [key: string]: string } = {
    "1": "japanese",
    "2": "english",
  };
  return languageMap[language.toLowerCase()] || language;
}

/**
 * 受け渡した文字の変換
 * 数字 → 文字
 * @param difficultyLevel 
 * @returns difficultyMap[difficultyLevel.toLowerCase()] || difficultyLevel
 */
function _convertDifficultyLevel(difficultyLevel: string): string {
  const difficultyMap: { [key: string]: string } = {
    "1": "easy",
    "2": "normal",
    "3": "hard",
  };
  return difficultyMap[difficultyLevel.toLowerCase()] || difficultyLevel;
}

/**
 * 文章を返す処理
 * @param language 
 * @param difficultyLevel 
 * @param count 
 * @returns sentences
 */
export function useSentence(
  language: string,
  difficultyLevel: string,
  count: number = 100
) {
  const convertedLanguage = _convertLanguage(language);
  const convertedDifficultyLevel = _convertDifficultyLevel(difficultyLevel);

  const sentences = async () => {
    try {
      const response = await fetch("/api/random-sentences", {
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
        throw new Error(`サーバーエラー: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("ネットワークエラーまたはその他例外が発生しました:", error);
      return null;
    }
  };

  return {
    sentences,
  };
}
