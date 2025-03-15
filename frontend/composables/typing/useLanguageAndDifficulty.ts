export enum Language {
  Japanese = 1,
  English = 2,
}

export enum Difficulty {
  Easy = 1,
  Normal = 2,
  Hard = 3,
}

const languageNames = {
  [Language.Japanese]: "日本語",
  [Language.English]: "英語",
} as const;

const difficultyNames = {
  [Difficulty.Easy]: "イージー",
  [Difficulty.Normal]: "ノーマル",
  [Difficulty.Hard]: "ハード",
} as const;

/**
 * 言語と難易度をそれぞれ定義
 * @returns Language: readonly(Language), Difficulty: readonly(Difficulty),
 * getLanguages, getDifficulties, getLanguageName, getDifficultyName,
 * generateAllCombinations
 */
export function useLanguageAndDifficulty() {
  /**
   * 言語一覧取得
   */
  const getLanguages = (): { id: number; name: "日本語" | "英語" }[] =>
    Object.entries(languageNames).map(([id, name]) => ({
      id: Number(id),
      name,
    }));

  /**
   * 難易度一覧取得
   */
  const getDifficulties = (): {
    id: number;
    name: "イージー" | "ノーマル" | "ハード";
  }[] =>
    Object.entries(difficultyNames).map(([id, name]) => ({
      id: Number(id),
      name,
    }));

  const getLanguageName = (id: Language) => languageNames[id];
  const getDifficultyName = (id: Difficulty) => difficultyNames[id];

  interface ScoreParams {
    languageId: Language;
    difficultyId: Difficulty;
  }

  /**
   * 全てのパターンを配列にする
   * @returns { languageId, difficultyId }
   */
  function generateAllCombinations(): ScoreParams[] {
    return getLanguages().flatMap((language) =>
      getDifficulties().map((difficulty) => ({
        languageId: language.id as Language,
        difficultyId: difficulty.id as Difficulty,
      }))
    );
  }

  return {
    Language: readonly(Language),
    Difficulty: readonly(Difficulty),
    getLanguages,
    getDifficulties,
    getLanguageName,
    getDifficultyName,
    generateAllCombinations,
  };
}
