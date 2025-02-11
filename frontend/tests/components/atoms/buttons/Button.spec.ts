import Button from "~/components/atoms/buttons/Button.vue";
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

describe("Button", () => {
  // 基本的なレンダリングテスト
  it("デフォルトpropsで正しくレンダリングされる", () => {
    const wrapper = mount(Button);
    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);
    expect(button.attributes("type")).toBe("button");
    expect(button.classes()).toContain("button-text--white");
    expect(button.classes()).toContain("button-border--none");
    expect(button.classes()).toContain("button-width--medium");
    expect(button.classes()).toContain("button-height--medium");
    expect(button.classes()).toContain("button-background--black");
    expect(button.classes()).not.toContain("button--rounded");
    expect(button.classes()).not.toContain("active");
  });

  // 全てのpropsのバリエーションをテスト
  describe("Props Variations", () => {
    it.each([
      ["button", "button"],
      ["submit", "submit"],
      ["reset", "reset"]
    ] as const)("type prop: %s が正しく適用される", (input, expected) => {
      const wrapper = mount(Button, { props: { type: input } });
      expect(wrapper.attributes("type")).toBe(expected);
    });

    it.each([
      "white",
      "black",
      "main-color",
      "sub-color"
    ] as const)("color prop: %s が正しく適用される", (color) => {
      const wrapper = mount(Button, { props: { color } });
      expect(wrapper.classes()).toContain(`button-text--${color}`);
    });

    it.each([
      "white",
      "black",
      "main-color",
      "sub-color",
      "none"
    ] as const)("border prop: %s が正しく適用される", (border) => {
      const wrapper = mount(Button, { props: { border } });
      expect(wrapper.classes()).toContain(`button-border--${border}`);
    });

    it.each([
      "small",
      "medium",
      "large",
      "same-as-input-large"
    ] as const)("width prop: %s が正しく適用される", (width) => {
      const wrapper = mount(Button, { props: { width } });
      expect(wrapper.classes()).toContain(`button-width--${width}`);
    });

    it.each([
      "small",
      "medium",
      "large"
    ] as const)("height prop: %s が正しく適用される", (height) => {
      const wrapper = mount(Button, { props: { height } });
      expect(wrapper.classes()).toContain(`button-height--${height}`);
    });

    it.each([
      "white",
      "black",
      "main-color",
      "sub-color",
      "none"
    ] as const)("background prop: %s が正しく適用される", (background) => {
      const wrapper = mount(Button, { props: { background } });
      expect(wrapper.classes()).toContain(`button-background--${background}`);
    });
  });

  // 特別なpropsのテスト
  describe("Special Props", () => {
    it("isRounded prop が true の時、rounded クラスが適用される", () => {
      const wrapper = mount(Button, { props: { isRounded: true } });
      expect(wrapper.classes()).toContain("button--rounded");
    });

    it("isActive prop が true の時、active クラスが適用される", () => {
      const wrapper = mount(Button, { props: { isActive: true } });
      expect(wrapper.classes()).toContain("active");
    });

    it("buttonText prop が正しく表示される", () => {
      const text = "テストボタン";
      const wrapper = mount(Button, { props: { buttonText: text } });
      expect(wrapper.text()).toBe(text);
    });
  });

  // スロットのテスト
  describe("Slots", () => {
    it("デフォルトスロットが正しく表示される", () => {
      const wrapper = mount(Button, {
        slots: {
          any: "スロットテスト"
        }
      });
      expect(wrapper.text()).toBe("スロットテスト");
    });

    it("HTMLコンテンツを含むスロットが正しく表示される", () => {
      const wrapper = mount(Button, {
        slots: {
          any: "<span class='test'>スロットテスト</span>"
        }
      });
      expect(wrapper.find("span.test").exists()).toBe(true);
      expect(wrapper.find("span.test").text()).toBe("スロットテスト");
    });
  });

  // イベントのテスト
  describe("Events", () => {
    it("クリックイベントが正しく発火する", async () => {
      const wrapper = mount(Button);
      await wrapper.trigger("click");
      expect(wrapper.emitted()).toHaveProperty("click");
      expect(wrapper.emitted("click")).toHaveLength(1);
    });

    it("複数回のクリックイベントが正しく発火する", async () => {
      const wrapper = mount(Button);
      await wrapper.trigger("click");
      await wrapper.trigger("click");
      await wrapper.trigger("click");
      expect(wrapper.emitted("click")).toHaveLength(3);
    });
  });
});
