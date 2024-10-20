import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import JapaneseRankingCard from "~/components/organisms/ranking/JapaneseRankingCard.vue";
import BaseRankingCard from "~/components/molecules/ranking/BaseRankingCard.vue";

vi.mock("~/composables/typing/useLanguageAndDifficulty", () => ({
  useLanguageAndDifficulty: () => ({
    getDifficultyName: vi.fn((id) => `Difficulty ${id}`),
  }),
}));

describe("JapaneseRankingCard", () => {
  it("コンポーネントが正しくレンダリングされる", () => {
    const mockRankingsByCombination: {
        [key: `1-${number}`]: Array<{
          rank: number;
          name: string;
          score: number;
          user_id: string;
          username: string;
        }>;
      } = {
        "1-1": [{ rank: 1, name: "User1", score: 100, user_id: "1", username: "user1" }],
        "1-2": [{ rank: 1, name: "User2", score: 200, user_id: "2", username: "user2" }],
        "1-3": [{ rank: 1, name: "User3", score: 300, user_id: "3", username: "user3" }],
      };

    const wrapper = mount(JapaneseRankingCard, {
      props: {
        rankingsByCombination: mockRankingsByCombination,
      },
      global: {
        stubs: {
          BaseRankingCard: true,
        },
      },
    });

    expect(wrapper.find(".ranking-cards-container").exists()).toBe(true);
    expect(wrapper.find(".ranking-cards").exists()).toBe(true);

    const rankingCards = wrapper.findAllComponents(BaseRankingCard);
    expect(rankingCards).toHaveLength(3);

    rankingCards.forEach((card, index) => {
      const difficultyId = index + 1;
      expect(card.props("difficultyName")).toBe(`Difficulty ${difficultyId}`);
      expect(card.props("rankings")).toEqual(
        mockRankingsByCombination[`1-${difficultyId}`]
      );
    });
  });

  it("ランキングデータがない場合、空の配列が渡される", () => {
    const wrapper = mount(JapaneseRankingCard, {
      props: {
        rankingsByCombination: {},
      },
      global: {
        stubs: {
          BaseRankingCard: true,
        },
      },
    });

    const rankingCards = wrapper.findAllComponents(BaseRankingCard);
    expect(rankingCards).toHaveLength(3);

    rankingCards.forEach((card) => {
      expect(card.props("rankings")).toEqual([]);
    });
  });
});
