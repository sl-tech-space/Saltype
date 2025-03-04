import { describe, it, expect } from "vitest";
import { splitId, splitString, joinWithHyphen } from "../../utils/stringUtils";

describe("stringUtils", () => {
  describe("splitId", () => {
    it("ハイフンで区切られた文字列を数値のオブジェクトに変換できること", () => {
      const result = splitId("123-456");
      expect(result).toEqual({ left: 123, right: 456 });
    });

    it("数値に変換できない場合はNaNを返すこと", () => {
      const result = splitId("abc-def");
      expect(result).toEqual({ left: NaN, right: NaN });
    });
  });

  describe("splitString", () => {
    it("デフォルトのカンマ区切りで文字列を分割できること", () => {
      const result = splitString("a,b,c");
      expect(result).toEqual(["a", "b", "c"]);
    });

    it("指定した区切り文字で文字列を分割できること", () => {
      const result = splitString("a|b|c", "|");
      expect(result).toEqual(["a", "b", "c"]);
    });

    it("空文字列の場合は空の配列を返すこと", () => {
      const result = splitString("");
      expect(result).toEqual([""]);
    });
  });

  describe("joinWithHyphen", () => {
    it("2つの文字列をハイフンで結合できること", () => {
      const result = joinWithHyphen("abc", "def");
      expect(result).toBe("abc-def");
    });

    it("空文字列の場合もハイフンで結合できること", () => {
      expect(joinWithHyphen("", "def")).toBe("-def");
      expect(joinWithHyphen("abc", "")).toBe("abc-");
      expect(joinWithHyphen("", "")).toBe("-");
    });
  });
});
