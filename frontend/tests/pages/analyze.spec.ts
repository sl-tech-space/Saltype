import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import AnalyzePage from "../../pages/analyze.vue";
import AnalyzeHeader from "../../components/organisms/analyze/AnalyzeHeader.vue";
import AnalyzeCard from "../../components/organisms/analyze/AnalyzeCard.vue";

const mockUseHead = vi.fn();

// useHeadのモック
vi.mock("#imports", () => ({
  useHead: mockUseHead,
}));

describe("AnalyzePage", () => {
  it("正しくレンダリングされること", () => {
    const wrapper = mount(AnalyzePage, {
      shallow: true,
    });

    // 必要なコンポーネントが存在することを確認
    expect(wrapper.findComponent(AnalyzeHeader).exists()).toBe(true);
    expect(wrapper.findComponent(AnalyzeCard).exists()).toBe(true);

    // ページのルート要素が正しいクラスを持つことを確認
    expect(wrapper.find(".page").exists()).toBe(true);
  });

  it("コンポーネントの順序が正しいこと", () => {
    const wrapper = mount(AnalyzePage, {
      shallow: true,
    });

    const children = wrapper.element.children;
    expect(children[0].tagName.toLowerCase()).toBe("analyze-header-stub");
    expect(children[1].tagName.toLowerCase()).toBe("analyze-card-stub");
  });
});
