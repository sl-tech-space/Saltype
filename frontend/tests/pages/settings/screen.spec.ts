import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick } from "vue";
import ScreenSettings from "../../../pages/settings/screen.vue";
import ScreenSettingHeader from "../../../components/organisms/settings/screen/ScreenSettingHeader.vue";
import ScreenSettingCard from "../../../components/organisms/settings/screen/ScreenSettingCard.vue";

const mockUseHead = vi.fn();

// useHeadのモック
vi.mock("#imports", () => ({
  useHead: mockUseHead,
}));

describe("ScreenSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正しくレンダリングされること", () => {
    const wrapper = mount(ScreenSettings, {
      shallow: true,
    });

    // 必要なコンポーネントが存在することを確認
    expect(wrapper.findComponent(ScreenSettingHeader).exists()).toBe(true);
    expect(wrapper.findComponent(ScreenSettingCard).exists()).toBe(true);

    // ページのルート要素が正しいクラスを持つことを確認
    expect(wrapper.classes()).toContain("page");
  });

  it("コンポーネントの順序が正しいこと", () => {
    const wrapper = mount(ScreenSettings, {
      shallow: true,
    });

    const children = wrapper.element.children;
    expect(children[0].tagName.toLowerCase()).toBe(
      "screen-setting-header-stub"
    );
    expect(children[1].tagName.toLowerCase()).toBe("screen-setting-card-stub");
  });
});
