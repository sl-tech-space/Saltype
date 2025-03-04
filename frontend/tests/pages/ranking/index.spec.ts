import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import RankingIndex from "../../../pages/ranking/index.vue";
import RankingHeader from "../../../components/organisms/ranking/RankingHeader.vue";
import JapaneseRankingCard from "../../../components/organisms/ranking/JapaneseRankingCard.vue";
import EnglishRankingCard from "../../../components/organisms/ranking/EnglishRankingCard.vue";
import DailyRankingCard from "../../../components/organisms/ranking/DailyRankingCard.vue";
import { useRanking } from "../../../composables/ranking/useRanking";

// useRankingのモック
vi.mock("../../../composables/ranking/useRanking", () => ({
  useRanking: vi.fn(),
}));

// useErrorNotificationのモック
vi.mock("../../../composables/common/useError", () => ({
  useErrorNotification: () => ({
    showErrorNotification: ref(false),
  }),
}));

// useHeadのモック
vi.mock("#imports", () => ({
  useHead: vi.fn(),
}));

describe("RankingIndex", () => {
  const mockRankings = [
    { id: 1, score: 100, username: "user1" },
    { id: 2, score: 90, username: "user2" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore
    vi.mocked(useRanking).mockReturnValue({
      isLoading: ref(false),
      error: ref(null),
      dailyJapaneseRankings: ref(mockRankings),
      dailyEnglishRankings: ref(mockRankings),
      japaneseRankings: ref(mockRankings),
      englishRankings: ref(mockRankings),
      getRankingByLimitParam: vi.fn(),
      getDailyRankingByLimitParam: vi.fn(),
    });
  });

  it("正しくレンダリングされること", () => {
    const wrapper = mount(RankingIndex, {
      shallow: true,
    });

    // 必要なコンポーネントが存在することを確認
    expect(wrapper.findComponent(RankingHeader).exists()).toBe(true);
    expect(wrapper.findComponent(JapaneseRankingCard).exists()).toBe(true);
    expect(wrapper.findComponent(EnglishRankingCard).exists()).toBe(true);
    expect(wrapper.findComponent(DailyRankingCard).exists()).toBe(true);
  });

  it("ランキングヘッダーに正しいタイトルが渡されること", () => {
    const wrapper = mount(RankingIndex, {
      shallow: true,
    });

    const headers = wrapper.findAllComponents(RankingHeader);
    expect(headers).toHaveLength(3);
    expect(headers[0].props("title")).toBe("ランキング<br>本日のチャンピオン");
    expect(headers[1].props("title")).toBe("ランキング<br>日本語");
    expect(headers[2].props("title")).toBe("ランキング<br>英語");
  });

  it("ランキングカードに正しいプロパティが渡されること", () => {
    const wrapper = mount(RankingIndex, {
      shallow: true,
    });

    const dailyCard = wrapper.findComponent(DailyRankingCard);
    expect(dailyCard.props()).toEqual({
      dailyJapaneseRankingsByCombination: mockRankings,
      dailyEnglishRankingsByCombination: mockRankings,
      dailyRankingDataLimit: 1,
    });

    const japaneseCard = wrapper.findComponent(JapaneseRankingCard);
    expect(japaneseCard.props()).toEqual({
      rankingsByCombination: mockRankings,
      rankingDataLimit: 5,
    });

    const englishCard = wrapper.findComponent(EnglishRankingCard);
    expect(englishCard.props()).toEqual({
      rankingsByCombination: mockRankings,
      rankingDataLimit: 5,
    });
  });
});
