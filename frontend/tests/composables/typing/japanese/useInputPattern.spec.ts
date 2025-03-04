import { describe, it, expect } from "vitest";
import { useInputPattern } from "../../../../composables/typing/japanese/useInputPattern";

describe("useInputPattern", () => {
  describe("getVowelPatternArray", () => {
    it("母音の入力パターンを正しく返す", () => {
      const { getVowelPatternArray } = useInputPattern();
      const vowels = getVowelPatternArray();

      expect(vowels).toEqual(["a", "i", "u", "e", "o"]);
    });

    it("配列の順序が正しい", () => {
      const { getVowelPatternArray } = useInputPattern();
      const vowels = getVowelPatternArray();

      expect(vowels[0]).toBe("a");
      expect(vowels[1]).toBe("i");
      expect(vowels[2]).toBe("u");
      expect(vowels[3]).toBe("e");
      expect(vowels[4]).toBe("o");
    });
  });

  describe("getSymbolsPatternArray", () => {
    it("記号の入力パターンを正しく返す", () => {
      const { getSymbolsPatternArray } = useInputPattern();
      const symbols = getSymbolsPatternArray();

      const expectedSymbols = [
        "?",
        ",",
        ".",
        "-",
        "!",
        "#",
        "%",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
      ];

      expect(symbols).toEqual(expectedSymbols);
    });

    it("記号が全て含まれている", () => {
      const { getSymbolsPatternArray } = useInputPattern();
      const symbols = getSymbolsPatternArray();

      // 記号
      expect(symbols).toContain("?");
      expect(symbols).toContain(",");
      expect(symbols).toContain(".");
      expect(symbols).toContain("-");
      expect(symbols).toContain("!");
      expect(symbols).toContain("#");
      expect(symbols).toContain("%");

      // 数字
      for (let i = 0; i <= 9; i++) {
        expect(symbols).toContain(i.toString());
      }
    });

    it("重複がない", () => {
      const { getSymbolsPatternArray } = useInputPattern();
      const symbols = getSymbolsPatternArray();
      const uniqueSymbols = new Set(symbols);

      expect(symbols.length).toBe(uniqueSymbols.size);
    });
  });
});
