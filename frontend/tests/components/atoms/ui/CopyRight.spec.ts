import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import CopyRight from "~/components/atoms/ui/CopyRight.vue";

describe("CopyRight", () => {
  // 基本的なレンダリングテスト
  describe("Basic Rendering", () => {
    it("正しい要素構造でレンダリングされる", () => {
      const wrapper = mount(CopyRight);
      expect(wrapper.find("footer").exists()).toBe(true);
      expect(wrapper.find("footer").classes()).toContain("copyright");
    });

    it("正しいテキスト形式で表示される", () => {
      const wrapper = mount(CopyRight);
      const currentYear = new Date().getFullYear();
      expect(wrapper.text()).toBe(`© ${currentYear} Saltype. All rights reserved.`);
    });
  });

  // 年表示のテスト
  describe("Year Display", () => {
    it("現在の年が正しく表示される", () => {
      const wrapper = mount(CopyRight);
      const currentYear = new Date().getFullYear();
      expect(wrapper.text()).toContain(currentYear.toString());
    });

    it("年が数値形式で表示される", () => {
      const wrapper = mount(CopyRight);
      const yearMatch = wrapper.text().match(/\d{4}/);
      expect(yearMatch).not.toBeNull();
      expect(Number.isInteger(Number(yearMatch![0]))).toBe(true);
    });
  });

  // テキストコンテンツのテスト
  describe("Text Content", () => {
    it("著作権記号(©)が含まれている", () => {
      const wrapper = mount(CopyRight);
      expect(wrapper.text()).toContain("©");
    });

    it("会社名が含まれている", () => {
      const wrapper = mount(CopyRight);
      expect(wrapper.text()).toContain("Saltype");
    });

    it("権利表記が含まれている", () => {
      const wrapper = mount(CopyRight);
      expect(wrapper.text()).toContain("All rights reserved");
    });

    it("テキストの順序が正しい", () => {
      const wrapper = mount(CopyRight);
      const currentYear = new Date().getFullYear();
      const expectedPattern = new RegExp(`© ${currentYear} Saltype\\. All rights reserved\\.`);
      expect(wrapper.text()).toMatch(expectedPattern);
    });
  });

  // スタイルのテスト
  describe("Styling", () => {
    it("footerに必要なクラスが適用されている", () => {
      const wrapper = mount(CopyRight);
      const footer = wrapper.find("footer");
      expect(footer.classes()).toContain("copyright");
    });
  });
});


