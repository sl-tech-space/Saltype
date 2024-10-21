import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Title from "~/components/atoms/texts/Title.vue";

describe("Title", () => {
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

  it.each(["white", "black", "main-color", "sub-color"] as const)(
    "カラー %s が正しく適用される",
    (color) => {
      const wrapper = mount(Title, {
        props: { color },
      });
      expect(wrapper.find("h1").classes()).toContain(`title--${color}`);
    }
  );

  it.each(["small", "medium", "large"] as const)(
    "サイズ %s が正しく適用される",
    (size) => {
      const wrapper = mount(Title, {
        props: { size },
      });
      expect(wrapper.find("h1").classes()).toContain(`title--${size}`);
    }
  );

  it("text propsが正しく表示される", () => {
    const wrapper = mount(Title, {
      props: {
        text: "テスト見出し",
      },
    });
    expect(wrapper.find("h1").text()).toBe("テスト見出し");
  });
});
