function convertLanguage(language: string): string {
  const languageMap: { [key: string]: string } = {
    "1": "japanese",
    "2": "english",
  };
  return languageMap[language.toLowerCase()] || language;
}

function convertDifficultyLevel(difficultyLevel: string): string {
  const difficultyMap: { [key: string]: string } = {
    "1": "easy",
    "2": "normal",
    "3": "hard",
  };
  return difficultyMap[difficultyLevel.toLowerCase()] || difficultyLevel;
}

export function useSentence(
  language: string,
  difficultyLevel: string,
  count: number = 100
) {
  const convertedLanguage = convertLanguage(language);
  const convertedDifficultyLevel = convertDifficultyLevel(difficultyLevel);

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
