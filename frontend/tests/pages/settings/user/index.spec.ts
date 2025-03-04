import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserSettings from "../../../../pages/settings/user/index.vue";
import UserSettingHeader from "../../../../components/organisms/settings/user/UserSettingHeader.vue";
import UserSettingCard from "../../../../components/organisms/settings/user/UserSettingCard.vue";

const mockUseHead = vi.fn();

// useHeadのモック
vi.mock("#imports", () => ({
  useHead: mockUseHead,
}));

describe("UserSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正しくレンダリングされること", () => {
    const wrapper = mount(UserSettings, {
      shallow: true,
    });

    // 必要なコンポーネントが存在することを確認
    expect(wrapper.findComponent(UserSettingHeader).exists()).toBe(true);
    expect(wrapper.findComponent(UserSettingCard).exists()).toBe(true);

    // ページのルート要素が正しいクラスを持つことを確認
    expect(wrapper.classes()).toContain("page");
  });

  it("コンポーネントの順序が正しいこと", () => {
    const wrapper = mount(UserSettings, {
      shallow: true,
    });

    const children = wrapper.element.children;
    expect(children[0].tagName.toLowerCase()).toBe("user-setting-header-stub");
    expect(children[1].tagName.toLowerCase()).toBe("user-setting-card-stub");
  });
});
