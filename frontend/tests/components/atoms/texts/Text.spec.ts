import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Text from "~/components/atoms/texts/Text.vue";

describe("Text", () => {
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

  it.each(["white", "black", "main-color", "sub-color"] as const)(
    "カラー %s が正しく適用される",
    (color) => {
      const wrapper = mount(Text, {
        props: { color },
      });
      expect(wrapper.find("p").classes()).toContain(`text--${color}`);
    }
  );

  it.each(["small", "medium", "large"] as const)(
    "サイズ %s が正しく適用される",
    (size) => {
      const wrapper = mount(Text, {
        props: { size },
      });
      expect(wrapper.find("p").classes()).toContain(`text--${size}`);
    }
  );

  it("text propsが正しく表示される", () => {
    const wrapper = mount(Text, {
      props: {
        text: "テストテキスト",
      },
    });
    expect(wrapper.find("p").text()).toBe("テストテキスト");
  });

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
});
