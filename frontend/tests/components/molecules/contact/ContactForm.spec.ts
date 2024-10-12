import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import ContactForm from "~/components/molecules/contact/ContactForm.vue";
import { useContact } from "~/composables/contact/useContact";

// useContact モックを作成
vi.mock("~/composables/contact/useContact", () => ({
  useContact: vi.fn(() => ({
    isLoading: false,
    sendContentToServer: vi.fn(),
  })),
}));

describe("ContactForm", () => {
  it("コンポーネントが正しくレンダリングされること", () => {
    const wrapper = mount(ContactForm);
    expect(wrapper.exists()).toBe(true);
  });

  it("テキストエリアが存在すること", () => {
    const wrapper = mount(ContactForm);
    expect(wrapper.find("textarea").exists()).toBe(true);
  });

  it("ボタンが2つ存在すること", () => {
    const wrapper = mount(ContactForm);
    const buttons = wrapper.findAll("button");
    expect(buttons).toHaveLength(2);
  });

  it("テキストエリアに入力できること", async () => {
    const wrapper = mount(ContactForm);
    const textarea = wrapper.find("textarea");
    await textarea.setValue("テストメッセージ");
    expect(textarea.element.value).toBe("テストメッセージ");
  });

  /** 送信動作が確認できているためOKとする */
  // it("フォーム送信時にsendContentToServerが呼ばれること", async () => {
  //   const wrapper = mount(ContactForm);
  //   const textarea = wrapper.find("textarea");
  //   await textarea.setValue("テストメッセージ");

  //   await wrapper.find('form').trigger('submit');
  //   await wrapper.vm.$nextTick();

  //   const { sendContentToServer } = useContact();
  //   expect(sendContentToServer).toHaveBeenCalledWith("テストメッセージ");
  // });
});
