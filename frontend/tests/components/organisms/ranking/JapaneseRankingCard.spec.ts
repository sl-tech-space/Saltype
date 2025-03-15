import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import JapaneseRankingCard from "../../../../components/organisms/ranking/JapaneseRankingCard.vue";

describe("JapaneseRankingCard", () => {
  const mockRankings = [
    { rank: 1, userId: "1", username: "user1", score: 100 },
    { rank: 2, userId: "2", username: "user2", score: 90 },
  ];

  const defaultProps = {
    rankingsByCombination: {
      "1-1": mockRankings,
      "1-2": mockRankings,
      "1-3": mockRankings,
    },
    rankingDataLimit: 10,
  };

  const mountComponent = () => {
    return mount(JapaneseRankingCard, {
      props: defaultProps,
      global: {
        stubs: {
          BaseRankingCard: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mountComponent();
    expect(wrapper.find(".ranking-cards-container").exists()).toBe(true);
    expect(wrapper.find(".ranking-cards").exists()).toBe(true);
  });

  it("ランキングカードが正しい数だけ表示される", () => {
    const wrapper = mountComponent();
    const rankingCards = wrapper.findAllComponents({ name: "BaseRankingCard" });
    expect(rankingCards).toHaveLength(3);
  });

  it("ランキングデータがない場合、空の配列が渡される", () => {
    const wrapper = mount(JapaneseRankingCard, {
      props: {
        rankingsByCombination: {},
        rankingDataLimit: 10,
      },
      global: {
        stubs: {
          BaseRankingCard: true,
        },
      },
    });

    const rankingCards = wrapper.findAllComponents({ name: "BaseRankingCard" });
    expect(rankingCards).toHaveLength(3);
    rankingCards.forEach((card) => {
      expect(card.props("rankings")).toEqual([]);
    });
  });
});
