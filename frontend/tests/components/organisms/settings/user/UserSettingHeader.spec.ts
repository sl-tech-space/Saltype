import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import UserSettingHeader from "../../../../../components/organisms/settings/user/UserSettingHeader.vue";
import BaseHeader from "../../../../../components/molecules/common/BaseHeader.vue";

describe("UserSettingHeader", () => {
  const mountComponent = () => {
    return mount(UserSettingHeader, {
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
    expect(baseHeader.props("title")).toBe("ユーザ設定");
  });
});
