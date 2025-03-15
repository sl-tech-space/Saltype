import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import ScorePage from "../../pages/score.vue";
import ScoreHeader from "../../components/organisms/score/ScoreHeader.vue";
import ScoreBoardCard from "../../components/organisms/score/ScoreBoardCard.vue";

const mockUseHead = vi.fn();

// useHeadのモック
vi.mock("#imports", () => ({
  useHead: mockUseHead,
}));

describe("ScorePage", () => {
  it("正しくレンダリングされること", () => {
    const wrapper = mount(ScorePage, {
      shallow: true,
    });

    // 必要なコンポーネントが存在することを確認
    expect(wrapper.findComponent(ScoreHeader).exists()).toBe(true);
    expect(wrapper.findComponent(ScoreBoardCard).exists()).toBe(true);

    // ページのルート要素が正しいクラスを持つことを確認
    expect(wrapper.find(".page").exists()).toBe(true);
  });

  it("コンポーネントの順序が正しいこと", () => {
    const wrapper = mount(ScorePage, {
      shallow: true,
    });

    const children = wrapper.element.children;
    expect(children[0].tagName.toLowerCase()).toBe("score-header-stub");
    expect(children[1].tagName.toLowerCase()).toBe("score-board-card-stub");
  });
});
