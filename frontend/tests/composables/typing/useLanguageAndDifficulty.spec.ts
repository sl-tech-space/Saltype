import { describe, it, expect } from "vitest";
import { useLanguageAndDifficulty, Language, Difficulty } from "../../../composables/typing/useLanguageAndDifficulty";

describe("useLanguageAndDifficulty", () => {
  const { getLanguages, getDifficulties, getLanguageName, getDifficultyName, generateAllCombinations } = useLanguageAndDifficulty();

  describe("getLanguages", () => {
    it("言語一覧を正しく取得できる", () => {
      const languages = getLanguages();

      expect(languages).toEqual([
        { id: Language.Japanese, name: "日本語" },
        { id: Language.English, name: "英語" },
      ]);
    });
  });

  describe("getDifficulties", () => {
    it("難易度一覧を正しく取得できる", () => {
      const difficulties = getDifficulties();

      expect(difficulties).toEqual([
        { id: Difficulty.Easy, name: "イージー" },
        { id: Difficulty.Normal, name: "ノーマル" },
        { id: Difficulty.Hard, name: "ハード" },
      ]);
    });
  });

  describe("getLanguageName", () => {
    it("言語IDから正しい言語名を取得できる", () => {
      expect(getLanguageName(Language.Japanese)).toBe("日本語");
      expect(getLanguageName(Language.English)).toBe("英語");
    });
  });

  describe("getDifficultyName", () => {
    it("難易度IDから正しい難易度名を取得できる", () => {
      expect(getDifficultyName(Difficulty.Easy)).toBe("イージー");
      expect(getDifficultyName(Difficulty.Normal)).toBe("ノーマル");
      expect(getDifficultyName(Difficulty.Hard)).toBe("ハード");
    });
  });

  describe("generateAllCombinations", () => {
    it("全ての言語と難易度の組み合わせを生成できる", () => {
      const combinations = generateAllCombinations();

      // 2言語 × 3難易度 = 6パターン
      expect(combinations).toHaveLength(6);

      // 全パターンの検証
      expect(combinations).toContainEqual({ languageId: Language.Japanese, difficultyId: Difficulty.Easy });
      expect(combinations).toContainEqual({ languageId: Language.Japanese, difficultyId: Difficulty.Normal });
      expect(combinations).toContainEqual({ languageId: Language.Japanese, difficultyId: Difficulty.Hard });
      expect(combinations).toContainEqual({ languageId: Language.English, difficultyId: Difficulty.Easy });
      expect(combinations).toContainEqual({ languageId: Language.English, difficultyId: Difficulty.Normal });
      expect(combinations).toContainEqual({ languageId: Language.English, difficultyId: Difficulty.Hard });
    });

    it("生成された組み合わせが重複していない", () => {
      const combinations = generateAllCombinations();
      const uniqueCombinations = new Set(combinations.map(c => `${c.languageId}-${c.difficultyId}`));

      expect(uniqueCombinations.size).toBe(combinations.length);
    });
  });

  describe("定数の定義", () => {
    it("言語の定数が正しく定義されている", () => {
      expect(Language.Japanese).toBe(1);
      expect(Language.English).toBe(2);
    });

    it("難易度の定数が正しく定義されている", () => {
      expect(Difficulty.Easy).toBe(1);
      expect(Difficulty.Normal).toBe(2);
      expect(Difficulty.Hard).toBe(3);
    });
  });
});
