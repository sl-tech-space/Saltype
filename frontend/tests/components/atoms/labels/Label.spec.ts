import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Label from "~/components/atoms/labels/Label.vue";

describe("Label", () => {
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

  it.each(["white", "black", "blue", "dark-blue"] as const)(
    "カラー %s が正しく適用される",
    (color) => {
      const wrapper = mount(Label, {
        props: { color },
      });
      expect(wrapper.find("label").classes()).toContain(`label--${color}`);
    }
  );

  it("for propsが正しく設定される", () => {
    const wrapper = mount(Label, {
      props: {
        for: "test-input",
      },
    });
    expect(wrapper.find("label").attributes("for")).toBe("test-input");
  });

  it("label propsが正しく表示される", () => {
    const wrapper = mount(Label, {
      props: {
        label: "テストラベル",
      },
    });
    expect(wrapper.find("label").text()).toBe("テストラベル");
  });
});
