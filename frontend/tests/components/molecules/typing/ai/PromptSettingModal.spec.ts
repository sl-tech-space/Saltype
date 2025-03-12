import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import PromptSettingModal from "../../../../../components/molecules/typing/ai/PromptSettingModal.vue";
import BaseModal from "../../../../../components/molecules/common/BaseModal.vue";
import Input from "../../../../../components/atoms/inputs/Input.vue";
import Button from "../../../../../components/atoms/buttons/Button.vue";
import { Form } from 'vee-validate';

const mockNavigateTo = vi.fn();
vi.mock("#app", () => ({
  navigateTo: mockNavigateTo
}));

describe("PromptSettingModal", () => {
  let wrapper: VueWrapper<any>;
  let mockLocalStorage: { [key: string]: string } = {};

  beforeEach(() => {
    mockLocalStorage = {};
    vi.clearAllMocks();
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: (key: string) => mockLocalStorage[key] || null,
        setItem: (key: string, value: string) => {
          mockLocalStorage[key] = value;
        },
      },
    });
  });

  const mountModal = (props = {}) => {
    return mount(PromptSettingModal, {
      props: {
        modelValue: true,
        ...props,
      },
      global: {
        stubs: {
          BaseModal: {
            template: '<div><slot name="modal-header" /><slot name="modal-body" /><slot name="modal-footer" /></div>',
            props: ['modelValue'],
          },
          Title: true,
          Button: {
            template: '<button @click="$emit(\'click\')"><slot>{{ buttonText }}</slot></button>',
            props: ['buttonText'],
          },
          Input: true,
          Text: true,
          Field: true,
          Form: {
            template: '<form @submit.prevent="$emit(\'submit\')"><slot /></form>',
            props: ['validation-schema'],
          },
        },
      },
    });
  };

  it("コンポーネントが正しくマウントされる", () => {
    wrapper = mountModal();
    expect(wrapper.vm).toBeTruthy();
  });

  it("modelValueの変更に応じてisOpenが更新される", async () => {
    wrapper = mountModal();
    expect(wrapper.vm.isOpen).toBe(true);
    await wrapper.setProps({ modelValue: false });
    expect(wrapper.vm.isOpen).toBe(false);
  });

  it("初期表示時にローカルストレージの値が読み込まれる", () => {
    mockLocalStorage["prompt"] = "テスト";
    wrapper = mountModal();
    expect(wrapper.vm.prompt).toBe("テスト");
  });

  it("ローカルストレージに値がない場合、デフォルト値が設定される", () => {
    wrapper = mountModal();
    expect(wrapper.vm.prompt).toBe("タイピング");
  });

  it("モーダルを開いた時にプロンプトが更新される", async () => {
    mockLocalStorage["prompt"] = "テスト";
    wrapper = mountModal({ modelValue: false });
    await wrapper.setProps({ modelValue: true });
    expect(wrapper.vm.prompt).toBe("テスト");
  });

  it("送信時にプロンプトがトリムされる", async () => {
    wrapper = mountModal();
    wrapper.vm.prompt = " テスト ";
    await wrapper.find('form').trigger('submit');
    expect(mockLocalStorage["prompt"]).toBe("テスト");
  });

  it("送信時にsubmitイベントが発火される", async () => {
    wrapper = mountModal();
    wrapper.vm.prompt = "テスト";
    await wrapper.find('form').trigger('submit');
    expect(wrapper.emitted("submit")?.[0]).toEqual(["テスト"]);
  });

  it("送信時にモーダルが閉じられる", async () => {
    wrapper = mountModal();
    wrapper.vm.prompt = "テスト";
    await wrapper.find('form').trigger('submit');
    expect(wrapper.emitted("update:model-value")?.[0]).toEqual([false]);
  });
});
