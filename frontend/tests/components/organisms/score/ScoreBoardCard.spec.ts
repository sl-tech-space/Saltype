import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import ScoreBoard from "~/components/organisms/score/ScoreBoardCard.vue";
import ScoreCard from "~/components/molecules/score/ScoreCard.vue";
import RankCard from "~/components/molecules/score/RankCard.vue";
import RetryCard from "~/components/molecules/score/RetryCard.vue";
import RankingCard from "~/components/molecules/score/RankingCard.vue";
import { useScoreBoardParam } from "~/composables/score/useScoreBoardParam";

vi.mock("~/composables/score/useScoreBoardParam", () => ({
  useScoreBoardParam: vi.fn(() => ({
    getParam: vi.fn().mockResolvedValue({
      score: 100,
      average_score: 80,
      rank: "A",
      ranking_position: 5
    })
  }))
}));

describe("ScoreBoardCard", () => {
  beforeEach(() => {
    // LocalStorageのモック
    const localStorageMock = {
      getItem: vi.fn((key) => {
        const storage: {
            [key: string]: string;
            language: string;
            difficulty: string;
            totalCorrectTypedCount: string;
            typingAccuracy: string;
        } = {
            language: "1",
            difficulty: "2",
            totalCorrectTypedCount: "500",
            typingAccuracy: "95"
        };
        return storage[key] || null;
      })
    };
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
  });

  it("コンポーネントが正しくレンダリングされ、子コンポーネントに適切なプロップが渡される", async () => {
    const wrapper = mount(ScoreBoard);

    await flushPromises();

    expect(wrapper.findComponent(ScoreCard).exists()).toBe(true);
    expect(wrapper.findComponent(RankCard).exists()).toBe(true);
    expect(wrapper.findComponent(RetryCard).exists()).toBe(true);
    expect(wrapper.findComponent(RankingCard).exists()).toBe(true);

    const scoreCard = wrapper.findComponent(ScoreCard);
    expect(scoreCard.props("yourTotalScore")).toBe(100);
    expect(scoreCard.props("yourAverageScore")).toBe(80);

    const rankCard = wrapper.findComponent(RankCard);
    expect(rankCard.props("rank")).toBe("A");

    const rankingCard = wrapper.findComponent(RankingCard);
    expect(rankingCard.props("ranking")).toBe(5);
  });

  it("スコアデータがない場合、デフォルト値が使用される", async () => {
    vi.mocked(useScoreBoardParam).mockReturnValue({
      getParam: vi.fn().mockResolvedValue(null)
    });

    const wrapper = mount(ScoreBoard);

    await flushPromises();

    const scoreCard = wrapper.findComponent(ScoreCard);
    expect(scoreCard.props("yourTotalScore")).toBe(0);
    expect(scoreCard.props("yourAverageScore")).toBe(0);

    const rankCard = wrapper.findComponent(RankCard);
    expect(rankCard.props("rank")).toBe("データなし");

    const rankingCard = wrapper.findComponent(RankingCard);
    expect(rankingCard.props("ranking")).toBe(0);
  });
});