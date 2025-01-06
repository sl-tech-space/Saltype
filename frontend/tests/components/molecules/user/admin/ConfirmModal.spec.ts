import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import ConfirmModal from "~/components/molecules/user/admin/ConfirmModal.vue";
import Button from "~/components/atoms/buttons/Button.vue";
import Title from "~/components/atoms/texts/Title.vue";
import Text from "~/components/atoms/texts/Text.vue";

describe("ConfirmModal", () => {
  const createWrapper = (props = {}) => {
    return mount(ConfirmModal, {
      props: {
        show: true,
        message: "テストメッセージ",
        onConfirm: vi.fn(),
        onCancel: vi.fn(),
        ...props,
      },
      global: {
        components: {
          Button,
          Title,
          Text,
        },
      },
    });
  };

  it("propsに基づいて正しくレンダリングされること", () => {
    const wrapper = createWrapper();
    expect(wrapper.find(".modal-overlay").exists()).toBe(true);
    expect(wrapper.findComponent(Title).props("text")).toBe("確認");
    expect(wrapper.findComponent(Text).text()).toBe("テストメッセージ");
    expect(wrapper.findAllComponents(Button).length).toBe(2);
  });

  it("showがfalseの場合、モーダルが表示されないこと", () => {
    const wrapper = createWrapper({ show: false });
    expect(wrapper.find(".modal-overlay").exists()).toBe(false);
  });

  it("確認ボタンをクリックするとonConfirmが呼ばれること", async () => {
    const onConfirm = vi.fn();
    const wrapper = createWrapper({ onConfirm });
    await wrapper.findAllComponents(Button)[0].trigger("click");
    expect(onConfirm).toHaveBeenCalled();
  });

  it("キャンセルボタンをクリックするとonCancelが呼ばれること", async () => {
    const onCancel = vi.fn();
    const wrapper = createWrapper({ onCancel });
    await wrapper.findAllComponents(Button)[1].trigger("click");
    expect(onCancel).toHaveBeenCalled();
  });

  it("ボタンのテキストが正しいこと", () => {
    const wrapper = createWrapper();
    const buttons = wrapper.findAllComponents(Button);
    expect(buttons[0].props("buttonText")).toBe("はい");
    expect(buttons[1].props("buttonText")).toBe("いいえ");
  });

  it("ボタンのスタイルが正しいこと", () => {
    const wrapper = createWrapper();
    const buttons = wrapper.findAllComponents(Button);
    buttons.forEach((button) => {
      expect(button.props("border")).toBe("main-color");
      expect(button.props("isRounded")).toBe(true);
    });
  });
});
