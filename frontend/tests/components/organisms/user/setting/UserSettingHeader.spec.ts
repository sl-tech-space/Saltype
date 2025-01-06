import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import UserSettingHeader from "~/components/organisms/user/setting/UserSettingHeader.vue";
import BaseHeader from "~/components/molecules/common/BaseHeader.vue";

describe("UserSettingHeader", () => {
  it("BaseHeaderコンポーネントが正しくレンダリングされること", () => {
    const wrapper = mount(UserSettingHeader, {
      global: {
        stubs: {
          BaseHeader: true,
        },
      },
    });

    expect(wrapper.findComponent(BaseHeader).exists()).toBe(true);
  });

  it("BaseHeaderコンポーネントに正しいタイトルが渡されること", () => {
    const wrapper = mount(UserSettingHeader);

    expect(wrapper.findComponent(BaseHeader).props("title")).toBe("ユーザ設定");
  });
});
