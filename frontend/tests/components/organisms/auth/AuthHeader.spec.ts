import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AuthHeader from "../../../../components/organisms/auth/AuthHeader.vue";
import Title from "../../../../components/atoms/texts/Title.vue";
import Icon from "../../../../components/atoms/imgs/Icon.vue";

describe("AuthHeader", () => {
  const mountComponent = () => {
    return mount(AuthHeader, {
      global: {
        components: {
          Title,
          Icon,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mountComponent();
    expect(wrapper.find(".brand").exists()).toBe(true);
    expect(wrapper.find(".brand-content").exists()).toBe(true);
  });

  it("アイコンが正しく表示される", () => {
    const wrapper = mountComponent();
    const icon = wrapper.findComponent(Icon);

    expect(icon.exists()).toBe(true);
    expect(icon.props()).toEqual({
      src: "/assets/images/common/saltype-icon.png",
      alt: "Saltypeアイコン",
      title: "Saltypeアイコン",
      loading: "eager",
      width: "large",
      height: "large",
    });
  });

  it("タイトルが正しく表示される", () => {
    const wrapper = mountComponent();
    const title = wrapper.findComponent(Title);

    expect(title.exists()).toBe(true);
    expect(title.props()).toEqual({
      color: "white",
      text: "Saltype",
      size: "large",
    });
  });
});
