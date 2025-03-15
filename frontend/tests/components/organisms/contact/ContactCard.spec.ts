import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ContactCard from "../../../../components/organisms/contact/ContactCard.vue";
import BaseCard from "../../../../components/molecules/common/BaseCard.vue";
import Title from "../../../../components/atoms/texts/Title.vue";
import ContactForm from "../../../../components/molecules/contact/ContactForm.vue";

describe("ContactCard", () => {
  const mountComponent = () => {
    return mount(ContactCard, {
      global: {
        components: {
          BaseCard,
          Title,
        },
        stubs: {
          ContactForm: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mountComponent();
    expect(wrapper.find(".contact-card").exists()).toBe(true);
  });

  it("BaseCardに正しいプロパティが渡される", () => {
    const wrapper = mountComponent();
    const baseCard = wrapper.findComponent(BaseCard);

    expect(baseCard.props()).toEqual({
      cardColor: "black",
      width: "large",
      height: "xl",
      headerSep: true,
      footerSep: false,
      sepColor: "sub-color",
      isFooter: false,
    });
  });

  it("タイトルが正しく表示される", () => {
    const wrapper = mountComponent();
    const title = wrapper.findComponent(Title);

    expect(title.props()).toEqual({
      color: "white",
      size: "small",
      text: "要望内容を入力してください",
    });
  });

  it("ContactFormコンポーネントが表示される", () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent({ name: "ContactForm" }).exists()).toBe(true);
  });
});
