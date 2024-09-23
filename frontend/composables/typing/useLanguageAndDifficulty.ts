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

export function useLanguageAndDifficulty() {
  // 言語の一覧を取得
  const getLanguages = () =>
    Object.entries(languageNames).map(([id, name]) => ({
      id: Number(id),
      name,
    }));

  // 難易度の一覧を取得
  const getDifficulties = () =>
    Object.entries(difficultyNames).map(([id, name]) => ({
      id: Number(id),
      name,
    }));

  // 言語IDから言語名を取得
  const getLanguageName = (id: Language) => languageNames[id];

  // 難易度IDから難易度名を取得
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
    generateAllCombinations
  };
}
