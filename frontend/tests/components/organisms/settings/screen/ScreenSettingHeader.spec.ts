import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ScreenSettingHeader from "../../../../../components/organisms/settings/screen/ScreenSettingHeader.vue";
import BaseHeader from "../../../../../components/molecules/common/BaseHeader.vue";

describe("ScreenSettingHeader", () => {
  const mountComponent = () => {
    return mount(ScreenSettingHeader, {
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
    expect(baseHeader.props("title")).toBe("画面設定");
  });
});
