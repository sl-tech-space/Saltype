import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import Analyze from "~/components/organisms/analyze/AnalyzeCard.vue";
import TypoFrequencyCard from "~/components/molecules/analyze/TypoFrequencyCard.vue";
import GrowthChartCard from "~/components/molecules/analyze/GrowthChartCard.vue";
import Loading from "~/components/molecules/common/ui/Loading.vue";

// モックの設定
vi.mock("~/composables/analyze/useAnalyze", () => ({
  useAnalyze: () => ({
    typoFrequency: { value: [] },
    getTypoFrequencyByLimitParam: vi.fn(),
    getPastScores: vi.fn().mockResolvedValue([]),
  }),
}));

vi.mock("~/composables/typing/useLanguageAndDifficulty", () => ({
  useLanguageAndDifficulty: () => ({
    generateAllCombinations: () => [{ languageId: "1", difficultyId: "1" }],
  }),
}));

describe("Analyze", () => {
  it("コンポーネントが正しくレンダリングされる", async () => {
    const wrapper = mount(Analyze, {
      global: {
        stubs: {
          TypoFrequencyCard: true,
          GrowthChartCard: true,
          Loading: true,
        },
      },
    });

    // onMountedの非同期処理を待つ
    await nextTick();

    // メインコンテナが存在することを確認
    expect(wrapper.find(".analyze-cards-container").exists()).toBe(true);

    // 左右のカードコンテナが存在することを確認
    expect(wrapper.find(".left-card").exists()).toBe(true);
    expect(wrapper.find(".right-card").exists()).toBe(true);

    // 子コンポーネントが正しくレンダリングされていることを確認
    expect(wrapper.findComponent(GrowthChartCard).exists()).toBe(true);
    expect(wrapper.findComponent(TypoFrequencyCard).exists()).toBe(true);
    expect(wrapper.findComponent(Loading).exists()).toBe(true);
  });
});
