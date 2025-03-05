import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import ContactPage from "../../pages/contact.vue";
import ContactHeader from "../../components/organisms/contact/ContactHeader.vue";
import ContactCard from "../../components/organisms/contact/ContactCard.vue";

const mockUseHead = vi.fn();

// useHeadのモック
vi.mock("#imports", () => ({
  useHead: mockUseHead,
}));

describe("ContactPage", () => {
  it("正しくレンダリングされること", () => {
    const wrapper = mount(ContactPage, {
      shallow: true,
    });

    // 必要なコンポーネントが存在することを確認
    expect(wrapper.findComponent(ContactHeader).exists()).toBe(true);
    expect(wrapper.findComponent(ContactCard).exists()).toBe(true);

    // ページのルート要素が正しいクラスを持つことを確認
    expect(wrapper.find(".page").exists()).toBe(true);
  });

  it("コンポーネントの順序が正しいこと", () => {
    const wrapper = mount(ContactPage, {
      shallow: true,
    });

    const children = wrapper.element.children;
    expect(children[0].tagName.toLowerCase()).toBe("contact-header-stub");
    expect(children[1].tagName.toLowerCase()).toBe("contact-card-stub");
  });
});
