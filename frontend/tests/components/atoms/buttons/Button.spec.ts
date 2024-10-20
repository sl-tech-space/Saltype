import Button from "~/components/atoms/buttons/Button.vue";
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

describe("Button", () => {
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
  });

  it("カスタムpropsで正しくレンダリングされる", () => {
    const wrapper = mount(Button, {
      props: {
        type: "submit",
        buttonText: "テストボタン",
        color: "main-color",
        border: "white",
        width: "large",
        height: "small",
        background: "sub-color",
        rounded: true,
      },
    });
    const button = wrapper.find("button");
    expect(button.attributes("type")).toBe("submit");
    expect(button.text()).toBe("テストボタン");
    expect(button.classes()).toContain("button-text--main-color");
    expect(button.classes()).toContain("button-border--white");
    expect(button.classes()).toContain("button-width--large");
    expect(button.classes()).toContain("button-height--small");
    expect(button.classes()).toContain("button-background--sub-color");
    expect(button.classes()).toContain("button--rounded");
  });

  it("スロットコンテンツを正しくレンダリングする", () => {
    const wrapper = mount(Button, {
      slots: {
        any: "<span>スロットテスト</span>",
      },
    });
    expect(wrapper.html()).toContain("<span>スロットテスト</span>");
  });

  it("クリックイベントが発火する", async () => {
    const wrapper = mount(Button);
    await wrapper.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("click");
  });
});
