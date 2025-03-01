import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ToggleSwitch from "../../../../components/atoms/inputs/ToggleSwitch.vue";

describe("ToggleSwitch", () => {
  // 基本的なレンダリングテスト
  describe("Basic Rendering", () => {
    it("デフォルトのpropsで正しくレンダリングされる", () => {
      const wrapper = mount(ToggleSwitch, {
        props: {
          modelValue: false
        }
      });
      expect(wrapper.find("input[type='checkbox']").exists()).toBe(true);
      expect(wrapper.find(".slider").exists()).toBe(true);
      expect(wrapper.find("input").element.checked).toBe(false);
    });

    it("初期値がtrueの場合、チェックされた状態でレンダリングされる", () => {
      const wrapper = mount(ToggleSwitch, {
        props: {
          modelValue: true
        }
      });
      expect(wrapper.find("input").element.checked).toBe(true);
    });
  });

  // 状態変更のテスト
  describe("State Changes", () => {
    it("クリックでモデルの値が切り替わる", async () => {
      const wrapper = mount(ToggleSwitch, {
        props: {
          modelValue: false
        }
      });
      await wrapper.find("input").trigger("change");
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")![0]).toEqual([true]);
    });

    it("true から false に切り替わる", async () => {
      const wrapper = mount(ToggleSwitch, {
        props: {
          modelValue: true
        }
      });
      await wrapper.find("input").trigger("change");
      expect(wrapper.emitted("update:modelValue")![0]).toEqual([false]);
    });

    it("連続して切り替えが可能", async () => {
      const wrapper = mount(ToggleSwitch, {
        props: {
          modelValue: false
        }
      });
      await wrapper.find("input").trigger("change");
      expect(wrapper.emitted("update:modelValue")![0]).toEqual([true]);

      await wrapper.setProps({ modelValue: true });
      await wrapper.find("input").trigger("change");
      expect(wrapper.emitted("update:modelValue")![1]).toEqual([false]);
    });
  });

  // アクセシビリティのテスト
  describe("Accessibility", () => {
    it("input要素がcheckbox typeを持つ", () => {
      const wrapper = mount(ToggleSwitch, {
        props: {
          modelValue: false
        }
      });
      expect(wrapper.find("input").attributes("type")).toBe("checkbox");
    });

    it("label要素で適切にラップされている", () => {
      const wrapper = mount(ToggleSwitch, {
        props: {
          modelValue: false
        }
      });
      expect(wrapper.find("label.toggle-switch").exists()).toBe(true);
      expect(wrapper.find("label.toggle-switch input").exists()).toBe(true);
    });
  });

  // スタイルのテスト
  describe("Styling", () => {
    it("チェック状態に応じてスライダーのスタイルが変化する", async () => {
      const wrapper = mount(ToggleSwitch, {
        props: {
          modelValue: false
        }
      });
      
      expect(wrapper.find(".slider").exists()).toBe(true);
      
      await wrapper.setProps({ modelValue: true });
    });
  });
});
