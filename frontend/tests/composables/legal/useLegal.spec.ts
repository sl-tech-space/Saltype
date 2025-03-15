import { describe, it, expect } from "vitest";
import { useLegal } from "../../../composables/legal/useLegal";
import type { LegalItem } from "../../../types/legal.d";

describe("useLegal", () => {
  const legal = useLegal();

  describe("getTermsOfServiceSentence", () => {
    it("利用規約の文章を正しく取得できる", () => {
      const terms = legal.getTermsOfServiceSentence();

      // 配列であることを確認
      expect(Array.isArray(terms)).toBe(true);
      // 必要な項目が含まれていることを確認
      expect(terms.length).toBeGreaterThan(0);

      // 最初の項目が正しい形式であることを確認
      const firstItem = terms[0];
      expect(firstItem).toEqual({
        title: "利用規約",
        size: "large",
        content: expect.any(String),
      });

      // 各項目が必要なプロパティを持っていることを確認
      terms.forEach((item: LegalItem) => {
        expect(item).toHaveProperty("title");
        expect(item).toHaveProperty("content");
        expect(typeof item.title).toBe("string");
        expect(typeof item.content).toBe("string");
      });
    });
  });

  describe("getPrivacyPolicySentence", () => {
    it("プライバシーポリシーの文章を正しく取得できる", () => {
      const privacy = legal.getPrivacyPolicySentence();

      expect(Array.isArray(privacy)).toBe(true);
      expect(privacy.length).toBeGreaterThan(0);

      const firstItem = privacy[0];
      expect(firstItem).toEqual({
        title: "プライバシーポリシー",
        size: "large",
        content: expect.any(String),
      });

      privacy.forEach((item: LegalItem) => {
        expect(item).toHaveProperty("title");
        expect(item).toHaveProperty("content");
        expect(typeof item.title).toBe("string");
        expect(typeof item.content).toBe("string");
      });
    });
  });

  describe("getCookiePolicySentence", () => {
    it("Cookieポリシーの文章を正しく取得できる", () => {
      const cookie = legal.getCookiePolicySentence();

      expect(Array.isArray(cookie)).toBe(true);
      expect(cookie.length).toBeGreaterThan(0);

      const firstItem = cookie[0];
      expect(firstItem).toEqual({
        title: "Cookieポリシー",
        size: "large",
        content: expect.any(String),
      });

      cookie.forEach((item: LegalItem) => {
        expect(item).toHaveProperty("title");
        expect(item).toHaveProperty("content");
        expect(typeof item.title).toBe("string");
        expect(typeof item.content).toBe("string");
      });
    });
  });

  describe("文章の整合性チェック", () => {
    it("各ポリシーの必須セクションが存在する", () => {
      const terms = legal.getTermsOfServiceSentence();
      const privacy = legal.getPrivacyPolicySentence();
      const cookie = legal.getCookiePolicySentence();

      // 利用規約の必須セクション
      expect(terms.some(item => item.title.includes("適用"))).toBe(true);
      expect(terms.some(item => item.title.includes("利用規約の変更"))).toBe(true);
      expect(terms.some(item => item.title.includes("禁止事項"))).toBe(true);

      // プライバシーポリシーの必須セクション
      expect(privacy.some(item => item.title.includes("個人情報"))).toBe(true);
      expect(privacy.some(item => item.title.includes("利用目的"))).toBe(true);
      expect(privacy.some(item => item.title.includes("第三者提供"))).toBe(true);

      // Cookieポリシーの必須セクション
      expect(cookie.some(item => item.title.includes("クッキーについて"))).toBe(true);
      expect(cookie.some(item => item.title.includes("利用目的"))).toBe(true);
      expect(cookie.some(item => item.title.includes("拒否方法"))).toBe(true);
    });
  });
});
