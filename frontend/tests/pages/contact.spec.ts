import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ContactPage from "~/pages/contact.vue";
import CursorEffect from "~/components/molecules/common/ui/CursorEffect.vue";
import ContactHeader from "~/components/organisms/contact/ContactHeader.vue";
import ContactCard from "~/components/organisms/contact/ContactCard.vue";

describe("ContactPage", () => {
  it("正しくレンダリングされること", async () => {
    const wrapper = mount(ContactPage, {
      global: {
        stubs: {
          CursorEffect: true,
          ContactHeader: true,
          ContactCard: true,
        },
      },
    });

    // 各コンポーネントが存在することを確認
    expect(wrapper.findComponent(CursorEffect).exists()).toBe(true);
    expect(wrapper.findComponent(ContactHeader).exists()).toBe(true);
    expect(wrapper.findComponent(ContactCard).exists()).toBe(true);

    // pageクラスを持つdiv要素が存在することを確認
    expect(wrapper.find(".page").exists()).toBe(true);

    // pageクラスを持つdiv要素の中にContactHeaderとContactCardが存在することを確認
    const pageDiv = wrapper.find(".page");
    expect(pageDiv.findComponent(ContactHeader).exists()).toBe(true);
    expect(pageDiv.findComponent(ContactCard).exists()).toBe(true);
  });
});
