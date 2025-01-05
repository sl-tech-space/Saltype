import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import UserSettingPage from "~/pages/user/setting/index.vue";
import CursorEffect from "~/components/molecules/common/ui/CursorEffect.vue";
import UserSettingHeader from "~/components/organisms/user/setting/UserSettingHeader.vue";
import UserSettingCard from "~/components/organisms/user/setting/UserSettingCard.vue";
import CopyRight from "~/components/atoms/ui/CopyRight.vue";

describe("UserSettingPage", () => {
  it("コンポーネントが正しくレンダリングされること", () => {
    const wrapper = mount(UserSettingPage, {
      global: {
        stubs: {
          CursorEffect: true,
          UserSettingHeader: true,
          UserSettingCard: true,
          CopyRight: true,
        },
        mocks: {
          useHead: vi.fn(),
        },
      },
    });

    // ページ全体の構造を確認
    expect(wrapper.find(".page").exists()).toBe(true);

    // 各コンポーネントが存在することを確認
    expect(wrapper.findComponent(CursorEffect).exists()).toBe(true);
    expect(wrapper.findComponent(UserSettingHeader).exists()).toBe(true);
    expect(wrapper.findComponent(UserSettingCard).exists()).toBe(true);
    expect(wrapper.findComponent(CopyRight).exists()).toBe(true);
  });
});
