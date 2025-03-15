import { describe, it, expect, vi } from "vitest";
import { useSentencePattern } from "../../../../composables/typing/japanese/useSentencePattern";
import { Romanizer } from "jp-transliterator";

// Romanizerのモック
vi.mock("jp-transliterator", () => ({
  Romanizer: vi.fn(() => ({
    transliterate: vi.fn(),
  })),
}));

describe("useSentencePattern", () => {
  describe("getAllCombinations", () => {
    it("正しいローマ字変換パターンを返す", async () => {
      const mockRomaji = [
        [["ka", "n", "ji"], "かんじ"],
        [["ka", "n", "zi"], "かんじ"],
      ];
      // @ts-ignore
      vi.mocked(Romanizer).mockImplementation(() => ({
        transliterate: vi.fn().mockReturnValue(mockRomaji),
      }));

      const { getAllCombinations } = useSentencePattern();
      const result = await getAllCombinations("かんじ");

      expect(result).toEqual(["kanji", "kanzi"]);
    });

    it("エラーの場合は例外をスロー", async () => {
      const mockError = { error: "変換エラー" };
      // @ts-ignore
      vi.mocked(Romanizer).mockImplementation(() => ({
        transliterate: vi.fn().mockReturnValue(mockError),
      }));

      const { getAllCombinations } = useSentencePattern();

      await expect(getAllCombinations("エラー")).rejects.toThrow("変換エラー");
    });

    it("変換結果がない場合は空配列を返す", async () => {
      // @ts-ignore
      vi.mocked(Romanizer).mockImplementation(() => ({
        transliterate: vi.fn().mockReturnValue(null),
      }));

      const { getAllCombinations } = useSentencePattern();
      const result = await getAllCombinations("テスト");

      expect(result).toEqual([]);
    });

    it("複数の変換パターンを正しく処理", async () => {
      const mockRomaji = [
        [["shi", "tsu"], "しつ"],
        [["si", "tu"], "しつ"],
        [["si", "tsu"], "しつ"],
        [["shi", "tu"], "しつ"],
      ];
      // @ts-ignore
      vi.mocked(Romanizer).mockImplementation(() => ({
        transliterate: vi.fn().mockReturnValue(mockRomaji),
      }));

      const { getAllCombinations } = useSentencePattern();
      const result = await getAllCombinations("しつ");

      expect(result).toEqual(["shitsu", "situ", "sitsu", "shitu"]);
    });
  });
});
