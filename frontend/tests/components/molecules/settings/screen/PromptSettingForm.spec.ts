import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import PromptSettingForm from "../../../../../components/molecules/settings/screen/PromptSettingForm.vue";

describe("PromptSettingForm", () => {
  const mountComponent = () => {
    return mount(PromptSettingForm, {
      global: {
        stubs: {
          Field: {
            template: `
              <div>
                <slot name="input" :field="{ value: modelValue, 'onUpdate:modelValue': (e) => $emit('update:modelValue', e) }"></slot>
              </div>
            `,
            props: ["modelValue"],
            emits: ["update:modelValue"],
          },
          Form: {
            template: `
              <form @submit.prevent="$emit('submit')">
                <slot :meta="{ valid: true }"></slot>
              </form>
            `,
          },
          Input: {
            template:
              '<input type="text" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ["modelValue"],
            emits: ["update:modelValue"],
          },
          Button: true,
        },
      },
    });
  };

  describe("バリデーション", () => {
    it("プロンプト設定後にイベントが発行される", async () => {
      const wrapper = mountComponent();
      const input = wrapper.find("input");
      await input.setValue("テスト");

      await wrapper.find("form").trigger("submit");

      const emitted = wrapper.emitted("prompt-updated");
      expect(emitted).toBeTruthy();
      expect(emitted?.[0]).toEqual(["テスト"]);
    });
  });
});
