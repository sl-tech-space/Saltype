import { describe, it, expect, vi } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import BaseModal from "../../../../components/molecules/common/BaseModal.vue";
import Button from "../../../../components/atoms/buttons/Button.vue";

// Teleportのモック
const TeleportMock = {
  template: "<div><slot /></div>",
};

describe("BaseModal", () => {
  let wrapper: VueWrapper<any>;

  const mountModal = (props = {}, slots = {}) => {
    return mount(BaseModal, {
      props: {
        modelValue: true,
        ...props,
      },
      slots,
      global: {
        stubs: {
          Teleport: TeleportMock,
          Button: true,
        },
      },
    });
  };

  it("コンポーネントが正しくマウントされる", () => {
    wrapper = mountModal();
    expect(wrapper.vm).toBeTruthy();
  });

  it("コンポーネントが正しくレンダリングされる", () => {
    wrapper = mountModal();
    expect(wrapper.html()).toContain("modal-overlay");
    expect(wrapper.html()).toContain("modal-content");
  });

  it("modelValueがtrueの場合、モーダルが表示される", () => {
    wrapper = mountModal();
    expect(wrapper.find(".modal-overlay").exists()).toBe(true);
    expect(wrapper.find(".modal-content").isVisible()).toBe(true);
  });

  it("modelValueがfalseの場合、モーダルが表示されない", async () => {
    wrapper = mountModal({ modelValue: false });
    expect(wrapper.find(".modal-overlay").exists()).toBe(false);
  });

  it("オーバーレイをクリックするとモーダルが閉じる", async () => {
    wrapper = mountModal();
    await wrapper.find(".modal-overlay").trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
  });

  it("モーダルコンテンツをクリックしてもモーダルが閉じない", async () => {
    wrapper = mountModal();
    await wrapper.find(".modal-content").trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeFalsy();
  });

  it("閉じるボタンをクリックするとモーダルが閉じる", async () => {
    wrapper = mountModal();
    await wrapper.findComponent(Button).trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
  });

  it("ヘッダー、ボディ、フッターのスロットが正しくレンダリングされる", () => {
    wrapper = mountModal(
      {},
      {
        "modal-header": "<h2>Test Header</h2>",
        "modal-body": "<p>Test Body</p>",
        "modal-footer": "<button>Custom Close</button>",
      }
    );
    expect(wrapper.find(".modal-header").html()).toContain(
      "<h2>Test Header</h2>"
    );
    expect(wrapper.find(".modal-body").html()).toContain("<p>Test Body</p>");
    expect(wrapper.find(".modal-footer").html()).toContain(
      "<button>Custom Close</button>"
    );
  });

  it("modelValueプロパティの変更に応じてisOpenが更新される", async () => {
    wrapper = mountModal();
    expect(wrapper.vm.isOpen).toBe(true);
    await wrapper.setProps({ modelValue: false });
    expect(wrapper.vm.isOpen).toBe(false);
    await wrapper.setProps({ modelValue: true });
    expect(wrapper.vm.isOpen).toBe(true);
  });
});
