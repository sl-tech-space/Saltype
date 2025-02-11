import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Label from "~/components/atoms/labels/Label.vue";

describe("Label", () => {
  // 基本的なレンダリングテスト
  describe("Basic Rendering", () => {
    it("デフォルトpropsで正しくレンダリングされる", () => {
      const wrapper = mount(Label);
      const label = wrapper.find("label");
      expect(label.exists()).toBe(true);
      expect(label.text()).toBe("ラベル");
      expect(label.classes()).toContain("label--white");
    });

    it("カスタムpropsで正しくレンダリングされる", () => {
      const wrapper = mount(Label, {
        props: {
          for: "custom-input",
          color: "blue",
          label: "カスタムラベル",
        },
      });
      const label = wrapper.find("label");
      expect(label.attributes("for")).toBe("custom-input");
      expect(label.classes()).toContain("label--blue");
      expect(label.text()).toBe("カスタムラベル");
    });
  });

  // カラーバリエーションのテスト
  describe("Color Variations", () => {
    it.each([
      { color: "white", desc: "デフォルトの白色" },
      { color: "black", desc: "黒色" },
      { color: "blue", desc: "メインカラー（青）" },
      { color: "dark-blue", desc: "サブカラー（濃い青）" }
    ] as const)("$desc ($color) が正しく適用される", ({ color }) => {
      const wrapper = mount(Label, {
        props: { color },
      });
      expect(wrapper.find("label").classes()).toContain(`label--${color}`);
    });

    it("propsが指定されていない場合、デフォルトのwhiteが適用される", () => {
      const wrapper = mount(Label, {
        props: {
        }
      });
      expect(wrapper.find("label").classes()).toContain("label--white");
    });
  });

  // for属性のテスト
  describe("For Attribute", () => {
    it("for属性が正しく設定される", () => {
      const wrapper = mount(Label, {
        props: {
          for: "test-input",
        },
      });
      expect(wrapper.find("label").attributes("for")).toBe("test-input");
    });

    it("for属性が未指定の場合、空文字が設定される", () => {
      const wrapper = mount(Label);
      expect(wrapper.find("label").attributes("for")).toBe("");
    });

    it("for属性に空文字が指定された場合、空文字が設定される", () => {
      const wrapper = mount(Label, {
        props: {
          for: "",
        },
      });
      expect(wrapper.find("label").attributes("for")).toBe("");
    });
  });

  // ラベルテキストのテスト
  describe("Label Text", () => {
    it("label propが正しく表示される", () => {
      const wrapper = mount(Label, {
        props: {
          label: "テストラベル",
        },
      });
      expect(wrapper.find("label").text()).toBe("テストラベル");
    });

    it("空文字のラベルが指定された場合、空で表示される", () => {
      const wrapper = mount(Label, {
        props: {
          label: "",
        },
      });
      expect(wrapper.find("label").text()).toBe("");
    });

    it("長いラベルテキストが正しく表示される", () => {
      const longText = "これは非常に長いラベルテキストです。".repeat(3);
      const wrapper = mount(Label, {
        props: {
          label: longText,
        },
      });
      expect(wrapper.find("label").text()).toBe(longText);
    });

    it("特殊文字を含むラベルが正しく表示される", () => {
      const specialChars = "!@#$%^&*()_+{}[]|\"':;/?><,.~`";
      const wrapper = mount(Label, {
        props: {
          label: specialChars,
        },
      });
      expect(wrapper.find("label").text()).toBe(specialChars);
    });
  });
});
