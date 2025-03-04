import { describe, it, expect } from "vitest";
import {
  convertNumberToEnglishLanguageName,
  convertNumberToEnglishDifficultyLevelName,
  convertNumberToJapaneseLanguageName,
  convertNumberToJapaneseDifficultyLevelName,
  objectToRankingItem,
  convertToUserList,
} from "../../utils/convertUtils";

describe("convertUtils", () => {
  describe("convertNumberToEnglishLanguageName", () => {
    it("数字を英語の言語名に変換できること", () => {
      expect(convertNumberToEnglishLanguageName("1")).toBe("japanese");
      expect(convertNumberToEnglishLanguageName("2")).toBe("english");
    });

    it("未定義の数字はそのまま返すこと", () => {
      expect(convertNumberToEnglishLanguageName("3")).toBe("3");
    });
  });

  describe("convertNumberToEnglishDifficultyLevelName", () => {
    it("数字を英語の難易度名に変換できること", () => {
      expect(convertNumberToEnglishDifficultyLevelName("1")).toBe("easy");
      expect(convertNumberToEnglishDifficultyLevelName("2")).toBe("normal");
      expect(convertNumberToEnglishDifficultyLevelName("3")).toBe("hard");
    });

    it("未定義の数字はそのまま返すこと", () => {
      expect(convertNumberToEnglishDifficultyLevelName("4")).toBe("4");
    });
  });

  describe("convertNumberToJapaneseLanguageName", () => {
    it("数字を日本語の言語名に変換できること", () => {
      expect(convertNumberToJapaneseLanguageName("1")).toBe("日本語");
      expect(convertNumberToJapaneseLanguageName("2")).toBe("英語");
    });

    it("未定義の数字はそのまま返すこと", () => {
      expect(convertNumberToJapaneseLanguageName("3")).toBe("3");
    });
  });

  describe("convertNumberToJapaneseDifficultyLevelName", () => {
    it("数字を日本語の難易度名に変換できること", () => {
      expect(convertNumberToJapaneseDifficultyLevelName("1")).toBe("イージー");
      expect(convertNumberToJapaneseDifficultyLevelName("2")).toBe("ノーマル");
      expect(convertNumberToJapaneseDifficultyLevelName("3")).toBe("ハード");
    });

    it("未定義の数字はそのまま返すこと", () => {
      expect(convertNumberToJapaneseDifficultyLevelName("4")).toBe("4");
    });
  });

  describe("objectToRankingItem", () => {
    it("オブジェクトを配列に変換できること", () => {
      const obj = {
        "1": { rank: 1, score: 100 },
        "2": { rank: 2, score: 90 },
      };
      const result = objectToRankingItem(obj);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ rank: 1, score: 100 });
      expect(result[1]).toEqual({ rank: 2, score: 90 });
    });

    it("配列の場合はそのまま返すこと", () => {
      const arr = [
        { rank: 1, score: 100 },
        { rank: 2, score: 90 },
      ];
      const result = objectToRankingItem(arr);
      expect(result).toBe(arr);
    });
  });

  describe("convertToUserList", () => {
    it("APIのユーザーデータを内部形式に変換できること", () => {
      const apiUser = {
        user_id: "123",
        username: "test_user",
        email: "test@example.com",
        highest_score: 100,
        rank_name: "Expert",
        password_exists: true,
      };

      const result = convertToUserList(apiUser);
      expect(result).toEqual({
        userId: "123",
        userName: "test_user",
        email: "test@example.com",
        todaysMaxScore: "100",
        userRank: "Expert",
        passwordExists: true,
      });
    });

    it("highest_scoreとrank_nameが未定義の場合のデフォルト値", () => {
      const apiUser = {
        user_id: "123",
        username: "test_user",
        email: "test@example.com",
        password_exists: false,
      };

      const result = convertToUserList(apiUser);
      expect(result.todaysMaxScore).toBe("0");
      expect(result.userRank).toBe("N/A");
    });
  });
});
