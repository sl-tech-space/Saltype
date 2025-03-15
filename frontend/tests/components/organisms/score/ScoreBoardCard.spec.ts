import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { ref } from "vue";
import ScoreBoardCard from "../../../../components/organisms/score/ScoreBoardCard.vue";
import ScoreCard from "../../../../components/molecules/score/ScoreCard.vue";
import RankCard from "../../../../components/molecules/score/RankCard.vue";
import RankingCard from "../../../../components/molecules/score/RankingCard.vue";

const mockGetParam = vi.fn();
const mockError = ref<string | null>(null);
const mockIsLoading = ref(false);

vi.mock("~/composables/score/useScoreBoardParam", () => ({
  useScoreBoardParam: () => ({
    getParam: mockGetParam,
    error: mockError,
    isLoading: mockIsLoading,
  }),
}));

describe("ScoreBoardCard", () => {
  beforeEach(() => {
    mockGetParam.mockReset();
    mockError.value = null;
    mockIsLoading.value = false;

    // LocalStorageのモック
    vi.stubGlobal("localStorage", {
      getItem: vi.fn().mockReturnValue("1-1"),
    });
  });

  const mountComponent = () => {
    return mount(ScoreBoardCard, {
      global: {
        stubs: {
          RetryCard: true,
          Loading: true,
          BaseNotification: true,
          ClientOnly: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mountComponent();
    expect(wrapper.find(".score-cards-container").exists()).toBe(true);
    expect(wrapper.find(".top-card").exists()).toBe(true);
    expect(wrapper.find(".bottom-card").exists()).toBe(true);
  });

  it("スコアデータが正しく表示される", async () => {
    mockGetParam.mockResolvedValue({
      score: 100,
      average_score: 80,
      rank: "A",
      ranking_position: 5,
    });

    const wrapper = mountComponent();
    await flushPromises();

    const scoreCard = wrapper.findComponent(ScoreCard);
    expect(scoreCard.props()).toEqual({
      yourTotalScore: 100,
      yourAverageScore: 80,
    });

    const rankCard = wrapper.findComponent(RankCard);
    expect(rankCard.props("rank")).toBe("A");

    const rankingCard = wrapper.findComponent(RankingCard);
    expect(rankingCard.props("ranking")).toBe(5);
  });

  it("スコアデータがない場合、デフォルト値が使用される", async () => {
    mockGetParam.mockResolvedValue(null);
    const wrapper = mountComponent();
    await flushPromises();

    const scoreCard = wrapper.findComponent(ScoreCard);
    expect(scoreCard.props()).toEqual({
      yourTotalScore: 0,
      yourAverageScore: 0,
    });

    const rankCard = wrapper.findComponent(RankCard);
    expect(rankCard.props("rank")).toBe("データなし");

    const rankingCard = wrapper.findComponent(RankingCard);
    expect(rankingCard.props("ranking")).toBe(0);
  });
});
