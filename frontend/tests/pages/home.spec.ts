import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import HomePage from "../../pages/home.vue";
import HomeHeader from "../../components/organisms/home/HomeHeader.vue";
import HomeCard from "../../components/organisms/home/HomeCard.vue";

const mockUseHead = vi.fn();

// useHeadのモック
vi.mock("#imports", () => ({
  useHead: mockUseHead,
}));

describe("HomePage", () => {
  it("正しくレンダリングされること", () => {
    const wrapper = mount(HomePage, {
      shallow: true,
    });

    // 必要なコンポーネントが存在することを確認
    expect(wrapper.findComponent(HomeHeader).exists()).toBe(true);
    expect(wrapper.findComponent(HomeCard).exists()).toBe(true);

    // ページのルート要素が正しいクラスを持つことを確認
    expect(wrapper.find(".page").exists()).toBe(true);
  });

  it("コンポーネントの順序が正しいこと", () => {
    const wrapper = mount(HomePage, {
      shallow: true,
    });

    const children = wrapper.element.children;
    expect(children[0].tagName.toLowerCase()).toBe("home-header-stub");
    expect(children[1].tagName.toLowerCase()).toBe("home-card-stub");
  });
});
