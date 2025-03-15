import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DailyRankingCard from "../../../../components/organisms/ranking/DailyRankingCard.vue";
import Title from "../../../../components/atoms/texts/Title.vue";

describe("DailyRankingCard", () => {
  const mockRankings = [
    { rank: 1, userId: "1", username: "user1", score: 100 },
    { rank: 2, userId: "2", username: "user2", score: 90 },
  ];

  const defaultProps = {
    dailyJapaneseRankingsByCombination: {
      "1-1": mockRankings,
      "1-2": mockRankings,
      "1-3": mockRankings,
    },
    dailyEnglishRankingsByCombination: {
      "2-1": mockRankings,
      "2-2": mockRankings,
      "2-3": mockRankings,
    },
    dailyRankingDataLimit: 10,
  };

  const mountComponent = () => {
    return mount(DailyRankingCard, {
      props: defaultProps,
      global: {
        components: {
          Title,
        },
        stubs: {
          BaseRankingCard: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mountComponent();
    expect(wrapper.find(".ranking-cards-container").exists()).toBe(true);
  });

  it("言語タイトルが正しく表示される", () => {
    const wrapper = mountComponent();
    const titles = wrapper.findAllComponents(Title);

    expect(titles).toHaveLength(2);
    expect(titles[0].props("text")).toBe("日本語");
    expect(titles[1].props("text")).toBe("英語");
  });

  it("ランキングカードが正しい数だけ表示される", () => {
    const wrapper = mountComponent();
    const rankingCards = wrapper.findAllComponents({ name: "BaseRankingCard" });

    expect(rankingCards).toHaveLength(6); // 日本語3つ + 英語3つ
  });
});
