import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import Select from "~/components/atoms/selects/Select.vue";

describe("Select", () => {
  const mockOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const mountComponent = (props = {}) => {
    return mount(Select, {
      props: {
        options: mockOptions,
        modelValue: null,
        ...props,
      },
    });
  };

  it("正しくレンダリングされること", () => {
    const wrapper = mountComponent();
    expect(wrapper.find(".custom-select").exists()).toBe(true);
    expect(wrapper.find(".selected-option").exists()).toBe(true);
  });

  it("デフォルトプロップスが正しく適用されること", () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toContain("select-text--white");
    expect(wrapper.classes()).toContain("select-border--none");
    expect(wrapper.classes()).toContain("select-width--medium");
    expect(wrapper.classes()).toContain("select-height--medium");
    expect(wrapper.classes()).toContain("select-background--black");
  });

  it("カスタムプロップスが正しく適用されること", () => {
    const wrapper = mountComponent({
      color: "main-color",
      border: "white",
      width: "large",
      height: "small",
      background: "sub-color",
      isRounded: true,
    });
    expect(wrapper.classes()).toContain("select-text--main-color");
    expect(wrapper.classes()).toContain("select-border--white");
    expect(wrapper.classes()).toContain("select-width--large");
    expect(wrapper.classes()).toContain("select-height--small");
    expect(wrapper.classes()).toContain("select-background--sub-color");
    expect(wrapper.classes()).toContain("select--rounded");
  });

  it("オプションリストが正しく表示されること", async () => {
    const wrapper = mountComponent();
    await wrapper.find(".custom-select").trigger("click");
    const options = wrapper.findAll(".options li");
    expect(options.length).toBe(3);
    expect(options[0].text()).toBe("Option 1");
    expect(options[1].text()).toBe("Option 2");
    expect(options[2].text()).toBe("Option 3");
  });

  it("オプション選択時に正しくemitされること", async () => {
    const wrapper = mountComponent();
    await wrapper.find(".custom-select").trigger("click");
    await wrapper.findAll(".options li")[1].trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["option2"]);
  });
});
