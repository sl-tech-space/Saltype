import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import HomeHeader from "../../../../components/organisms/home/HomeHeader.vue";
import BaseHeader from "../../../../components/molecules/common/BaseHeader.vue";

describe("HomeHeader", () => {
  const mountComponent = () => {
    return mount(HomeHeader, {
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
    expect(baseHeader.props("title")).toBe("ホーム");
  });
});
