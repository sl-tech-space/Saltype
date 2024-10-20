import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ScorePage from "~/pages/score.vue";
import CursorEffect from "~/composables/ui/useCursorEffect.vue";
import ScoreHeader from "~/components/organisms/score/ScoreHeader.vue";
import ScoreBoardCard from "~/components/organisms/score/ScoreBoardCard.vue";

describe("ScorePage", () => {
  it("正しくレンダリングされること", () => {
    const wrapper = mount(ScorePage, {
      global: {
        stubs: {
          CursorEffect: true,
          ScoreHeader: true,
          ScoreBoardCard: true,
        },
      },
    });

    // 各コンポーネントが存在することを確認
    expect(wrapper.findComponent(CursorEffect).exists()).toBe(true);
    expect(wrapper.findComponent(ScoreHeader).exists()).toBe(true);
    expect(wrapper.findComponent(ScoreBoardCard).exists()).toBe(true);

    // pageクラスを持つdiv要素が存在することを確認
    expect(wrapper.find(".page").exists()).toBe(true);

    // pageクラスを持つdiv要素の中にScoreHeaderとScoreBoardCardが存在することを確認
    const pageDiv = wrapper.find(".page");
    expect(pageDiv.findComponent(ScoreHeader).exists()).toBe(true);
    expect(pageDiv.findComponent(ScoreBoardCard).exists()).toBe(true);
  });
});
