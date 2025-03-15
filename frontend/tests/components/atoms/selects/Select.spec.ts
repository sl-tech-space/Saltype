import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import Select from "../../../../components/atoms/selects/Select.vue";

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

  // 基本的なレンダリングテスト
  describe("Basic Rendering", () => {
    it("正しくレンダリングされること", () => {
      const wrapper = mountComponent();
      expect(wrapper.find(".custom-select").exists()).toBe(true);
      expect(wrapper.find(".selected-option").exists()).toBe(true);
      expect(wrapper.find(".arrow").exists()).toBe(true);
    });

    it("デフォルトプロップスが正しく適用されること", () => {
      const wrapper = mountComponent();
      expect(wrapper.classes()).toContain("select-text--white");
      expect(wrapper.classes()).toContain("select-border--none");
      expect(wrapper.classes()).toContain("select-width--medium");
      expect(wrapper.classes()).toContain("select-height--medium");
      expect(wrapper.classes()).toContain("select-background--black");
      expect(wrapper.classes()).not.toContain("select--rounded");
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
  });

  // オプション表示のテスト
  describe("Options Display", () => {
    it("オプションリストが正しく表示されること", async () => {
      const wrapper = mountComponent();
      await wrapper.find(".custom-select").trigger("click");
      const options = wrapper.findAll(".options li");
      expect(options.length).toBe(3);
      expect(options[0].text()).toBe("Option 1");
      expect(options[1].text()).toBe("Option 2");
      expect(options[2].text()).toBe("Option 3");
    });

    it("空のオプションリストの場合も正しく処理されること", () => {
      const wrapper = mountComponent({ options: [] });
      expect(wrapper.find(".selected-option").text()).toBe("選択してください");
    });

    it("selectTextが正しく表示されること", () => {
      const wrapper = mountComponent({
        selectText: "選択: ",
        modelValue: "option1"
      });
      expect(wrapper.find(".selected-option").text()).toContain("選択: Option 1");
    });
  });

  // 選択動作のテスト
  describe("Selection Behavior", () => {
    it("オプション選択時に正しくemitされること", async () => {
      const wrapper = mountComponent();
      await wrapper.find(".custom-select").trigger("click");
      await wrapper.findAll(".options li")[1].trigger("click");
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["option2"]);
    });

    it("選択後にオプションリストが閉じること", async () => {
      const wrapper = mountComponent();
      await wrapper.find(".custom-select").trigger("click");
      await wrapper.findAll(".options li")[0].trigger("click");
      expect(wrapper.find(".options").exists()).toBe(false);
    });

    it("modelValueの変更が表示に反映されること", async () => {
      const wrapper = mountComponent();
      await wrapper.setProps({ modelValue: "option2" });
      expect(wrapper.find(".selected-option").text()).toContain("Option 2");
    });
  });
});
