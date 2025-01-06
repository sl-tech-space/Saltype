import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import ColorCustomizer from "~/components/molecules/home/ColorCustomizer.vue";
import Label from "~/components/atoms/labels/Label.vue";
import Input from "~/components/atoms/inputs/Input.vue";
import { useColorStore } from "~/store/colorStore";

vi.mock("~/store/colorStore", () => ({
  useColorStore: vi.fn(() => ({
    colorStore: {
      textColor: "#000000",
      backgroundColor: "#FFFFFF",
      mainColor: "#FF0000",
      subColor: "#00FF00",
      hoverColor: "#0000FF",
    },
    setColor: vi.fn(),
  })),
}));

describe("ColorCustomizer", () => {
  const mountComponent = () => {
    return mount(ColorCustomizer, {
      global: {
        components: {
          Label,
          Input,
        },
      },
    });
  };

  it("正しくレンダリングされること", () => {
    const wrapper = mountComponent();
    expect(wrapper.findAllComponents(Label).length).toBe(5);
    expect(wrapper.findAllComponents(Input).length).toBe(5);
  });

  it("各色設定が正しいラベルで表示されること", () => {
    const wrapper = mountComponent();
    const labels = wrapper.findAllComponents(Label);
    expect(labels[0].props("label")).toBe("テキストの色設定 :");
    expect(labels[1].props("label")).toBe("背景の色設定 :");
    expect(labels[2].props("label")).toBe("メインの色設定 :");
    expect(labels[3].props("label")).toBe("サブの色設定 :");
    expect(labels[4].props("label")).toBe("カーソルを当てた時の色設定 :");
  });
});
