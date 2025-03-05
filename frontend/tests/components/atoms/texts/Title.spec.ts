import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Title from "../../../../components/atoms/texts/Title.vue";

describe("Title", () => {
  // 基本的なレンダリングテスト
  describe("Basic Rendering", () => {
    it("デフォルトpropsで正しくレンダリングされる", () => {
      const wrapper = mount(Title);
      const h1 = wrapper.find("h1");
      expect(h1.exists()).toBe(true);
      expect(h1.classes()).toContain("title--white");
      expect(h1.classes()).toContain("title--medium");
      expect(h1.text()).toBe("見出し");
    });

    it("カスタムpropsで正しくレンダリングされる", () => {
      const wrapper = mount(Title, {
        props: {
          color: "main-color",
          size: "large",
          text: "カスタム見出し",
        },
      });
      const h1 = wrapper.find("h1");
      expect(h1.classes()).toContain("title--main-color");
      expect(h1.classes()).toContain("title--large");
      expect(h1.text()).toBe("カスタム見出し");
    });
  });

  // カラーバリエーションのテスト
  describe("Color Variations", () => {
    it.each([
      { color: "white", desc: "デフォルトの白色" },
      { color: "black", desc: "黒色" },
      { color: "main-color", desc: "メインカラー" },
      { color: "sub-color", desc: "サブカラー" }
    ] as const)("$desc ($color) が正しく適用される", ({ color }) => {
      const wrapper = mount(Title, {
        props: { color },
      });
      expect(wrapper.find("h1").classes()).toContain(`title--${color}`);
    });

    it("propsが指定されていない場合、デフォルトのwhiteが適用される", () => {
      const wrapper = mount(Title, {
        props: {},
      });
      expect(wrapper.find("h1").classes()).toContain("title--white");
    });
  });

  // サイズバリエーションのテスト
  describe("Size Variations", () => {
    it.each([
      { size: "small", desc: "小さいサイズ" },
      { size: "medium", desc: "中間サイズ" },
      { size: "large", desc: "大きいサイズ" }
    ] as const)("$desc ($size) が正しく適用される", ({ size }) => {
      const wrapper = mount(Title, {
        props: { size },
      });
      expect(wrapper.find("h1").classes()).toContain(`title--${size}`);
    });

    it("propsが指定されていない場合、デフォルトのmediumが適用される", () => {
      const wrapper = mount(Title, {
        props: {},
      });
      expect(wrapper.find("h1").classes()).toContain("title--medium");
    });
  });

  // テキストコンテンツのテスト
  describe("Text Content", () => {
    it("text propsが正しく表示される", () => {
      const wrapper = mount(Title, {
        props: {
          text: "テスト見出し",
        },
      });
      expect(wrapper.find("h1").text()).toBe("テスト見出し");
    });

    it("空のtext propsが正しく処理される", () => {
      const wrapper = mount(Title, {
        props: {
          text: "",
        },
      });
      expect(wrapper.find("h1").text()).toBe("");
    });

    it("長いテキストが正しく表示される", () => {
      const longText = "これは非常に長い見出しテキストです。".repeat(3);
      const wrapper = mount(Title, {
        props: {
          text: longText,
        },
      });
      expect(wrapper.find("h1").text()).toBe(longText);
    });

    it("HTMLタグを含むテキストが正しくレンダリングされる", () => {
      const htmlText = "見出し with <strong>強調</strong> テキスト";
      const wrapper = mount(Title, {
        props: {
          text: htmlText,
        },
      });
      const h1 = wrapper.find("h1");
      expect(h1.html()).toContain("<strong>強調</strong>");
      expect(h1.find("strong").exists()).toBe(true);
      expect(h1.find("strong").text()).toBe("強調");
    });

    it("特殊文字を含むテキストが正しく表示される", () => {
      const specialChars = "!@#$%^&*()_+{}[]|\"':;/?>,.~`<";
      const wrapper = mount(Title, {
        props: {
          text: specialChars,
        },
      });
      expect(wrapper.find("h1").text()).toBe(specialChars);
    });
  });
});
