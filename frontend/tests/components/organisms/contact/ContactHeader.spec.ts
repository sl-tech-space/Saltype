import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ContactHeader from "../../../../components/organisms/contact/ContactHeader.vue";
import BaseHeader from "../../../../components/molecules/common/BaseHeader.vue";

describe("ContactHeader", () => {
  const mountComponent = () => {
    return mount(ContactHeader, {
      global: {
        components: {
          BaseHeader,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent(BaseHeader).exists()).toBe(true);
  });

  it("BaseHeaderに正しいタイトルが渡される", () => {
    const wrapper = mountComponent();
    const baseHeader = wrapper.findComponent(BaseHeader);
    expect(baseHeader.props("title")).toBe("ご要望");
  });
});
