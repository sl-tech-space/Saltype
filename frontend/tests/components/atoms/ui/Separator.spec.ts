import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Separator from "../../../../components/atoms/ui/Separator.vue";

describe("Separator", () => {
  // 基本的なレンダリングテスト
  describe("Basic Rendering", () => {
    it("デフォルトpropsで正しくレンダリングされる", () => {
      const wrapper = mount(Separator);
      const separator = wrapper.find(".separator");
      expect(separator.exists()).toBe(true);
      expect(separator.classes()).toContain("separator--white");
      expect(separator.classes()).toContain("separator--none");
    });

    it("カスタムpropsで正しくレンダリングされる", () => {
      const wrapper = mount(Separator, {
        props: {
          color: "main-color",
          width: "large",
          margin: "vertical",
        },
      });
      const separator = wrapper.find(".separator");
      expect(separator.classes()).toContain("separator--main-color");
      expect(separator.classes()).toContain("separator--large");
      expect(separator.classes()).toContain("separator--vertical");
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
      const wrapper = mount(Separator, {
        props: { color },
      });
      expect(wrapper.find(".separator").classes()).toContain(`separator--${color}`);
    });

    it("propsが指定されていない場合、デフォルトのwhiteが適用される", () => {
      const wrapper = mount(Separator, {
        props: {},
      });
      expect(wrapper.find(".separator").classes()).toContain("separator--white");
    });
  });

  // 幅のバリエーションのテスト
  describe("Width Variations", () => {
    it.each([
      { width: "small", desc: "小さい幅" },
      { width: "medium", desc: "中間幅" },
      { width: "large", desc: "大きい幅" }
    ] as const)("$desc ($width) が正しく適用される", ({ width }) => {
      const wrapper = mount(Separator, {
        props: { width },
      });
      expect(wrapper.find(".separator").classes()).toContain(`separator--${width}`);
    });
  });

  // マージンのバリエーションのテスト
  describe("Margin Variations", () => {
    it.each([
      { margin: "none", desc: "マージンなし" },
      { margin: "vertical", desc: "垂直マージン" },
      { margin: "horizontal", desc: "水平マージン" }
    ] as const)("$desc ($margin) が正しく適用される", ({ margin }) => {
      const wrapper = mount(Separator, {
        props: { margin },
      });
      expect(wrapper.find(".separator").classes()).toContain(`separator--${margin}`);
    });

    it("marginが指定されていない場合、デフォルトのnoneが適用される", () => {
      const wrapper = mount(Separator);
      expect(wrapper.find(".separator").classes()).toContain("separator--none");
    });
  });

  // 表示制御のテスト
  describe("Visibility Control", () => {
    it("visibleがfalseの場合、要素が表示されない", () => {
      const wrapper = mount(Separator, {
        props: { visible: false },
      });
      expect(wrapper.find(".separator").exists()).toBe(false);
    });

    it("visibleがtrueの場合、要素が表示される", () => {
      const wrapper = mount(Separator, {
        props: { visible: true },
      });
      expect(wrapper.find(".separator").exists()).toBe(true);
    });

    it("visibleが指定されていない場合、デフォルトでtrueとなり要素が表示される", () => {
      const wrapper = mount(Separator);
      expect(wrapper.find(".separator").exists()).toBe(true);
    });
  });

  // クラス組み合わせのテスト
  describe("Class Combinations", () => {
    it("複数のプロパティが同時に適用される", () => {
      const wrapper = mount(Separator, {
        props: {
          color: "main-color",
          width: "large",
          margin: "vertical",
        },
      });
      const separator = wrapper.find(".separator");
      expect(separator.classes()).toContain("separator--main-color");
      expect(separator.classes()).toContain("separator--large");
      expect(separator.classes()).toContain("separator--vertical");
    });
  });
});
