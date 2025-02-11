import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Text from "~/components/atoms/texts/Text.vue";

describe("Text", () => {
  // 基本的なレンダリングテスト
  describe("Basic Rendering", () => {
    it("デフォルト propsで正しくレンダリングされる", () => {
      const wrapper = mount(Text);
      const p = wrapper.find("p");
      expect(p.exists()).toBe(true);
      expect(p.classes()).toContain("text--white");
      expect(p.classes()).toContain("text--medium");
      expect(p.text()).toBe("");
    });

    it("カスタム propsで正しくレンダリングされる", () => {
      const wrapper = mount(Text, {
        props: {
          color: "main-color",
          size: "large",
          text: "カスタムテキスト",
        },
      });
      const p = wrapper.find("p");
      expect(p.classes()).toContain("text--main-color");
      expect(p.classes()).toContain("text--large");
      expect(p.text()).toBe("カスタムテキスト");
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
      const wrapper = mount(Text, {
        props: { color },
      });
      expect(wrapper.find("p").classes()).toContain(`text--${color}`);
    });

    it("propsが指定されていない場合、デフォルトのwhiteが適用される", () => {
      const wrapper = mount(Text, {
        props: {},
      });
      expect(wrapper.find("p").classes()).toContain("text--white");
    });
  });

  // サイズバリエーションのテスト
  describe("Size Variations", () => {
    it.each([
      { size: "small", desc: "小さいサイズ" },
      { size: "medium", desc: "中間サイズ" },
      { size: "large", desc: "大きいサイズ" }
    ] as const)("$desc ($size) が正しく適用される", ({ size }) => {
      const wrapper = mount(Text, {
        props: { size },
      });
      expect(wrapper.find("p").classes()).toContain(`text--${size}`);
    });

    it("propsが指定されていない場合、デフォルトのmediumが適用される", () => {
      const wrapper = mount(Text, {
        props: {},
      });
      expect(wrapper.find("p").classes()).toContain("text--medium");
    });
  });

  // テキストコンテンツのテスト
  describe("Text Content", () => {
    it("text propsが正しく表示される", () => {
      const wrapper = mount(Text, {
        props: {
          text: "テストテキスト",
        },
      });
      expect(wrapper.find("p").text()).toBe("テストテキスト");
    });

    it("空のtext propsが正しく処理される", () => {
      const wrapper = mount(Text, {
        props: {
          text: "",
        },
      });
      expect(wrapper.find("p").text()).toBe("");
    });

    it("長いテキストが正しく表示される", () => {
      const longText = "これは非常に長いテキストです。".repeat(10);
      const wrapper = mount(Text, {
        props: {
          text: longText,
        },
      });
      expect(wrapper.find("p").text()).toBe(longText);
    });
  });

  // スロットのテスト
  describe("Slot Content", () => {
    it("スロットコンテンツが正しく表示される", () => {
      const wrapper = mount(Text, {
        slots: {
          default: "スロットテキスト",
        },
      });
      expect(wrapper.find("p").text()).toBe("スロットテキスト");
    });

    it("スロットコンテンツとtextプロップが両方ある場合、両方が表示される", () => {
      const wrapper = mount(Text, {
        props: {
          text: "propsテキスト",
        },
        slots: {
          default: "スロットテキスト",
        },
      });
      expect(wrapper.find("p").text()).toBe("スロットテキスト propsテキスト");
    });

    it("HTMLコンテンツを含むスロットが正しく表示される", () => {
      const wrapper = mount(Text, {
        slots: {
          default: '<span class="test">HTMLコンテンツ</span>',
        },
      });
      expect(wrapper.find("span.test").exists()).toBe(true);
      expect(wrapper.find("span.test").text()).toBe("HTMLコンテンツ");
    });
  });
});
