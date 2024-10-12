import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import RankingCard from "~/components/molecules/score/RankingCard.vue";
import BaseCard from "~/components/molecules/common/BaseCard.vue";
import Button from "~/components/atoms/buttons/Button.vue";
import Title from "~/components/atoms/texts/Title.vue";
import Text from "~/components/atoms/texts/Text.vue";
import type { RankingItem } from "~/composables/ranking/useRankingTypes";

describe("RankingCard", () => {
  const mockRankings: RankingItem[] = [
    { user_id: "1", username: "User1", score: 100 },
    { user_id: "2", username: "User2", score: 90 },
    { user_id: "3", username: "User3", score: 80 },
    { user_id: "4", username: "User4", score: 70 },
    { user_id: "5", username: "User5", score: 60 },
  ];

  const mountComponent = (props: {
    difficultyName: string;
    rankings: RankingItem[] | RankingItem[][];
    ranking: number
  }) => {
    return mount(RankingCard, {
      props,
      global: {
        components: {
          BaseCard,
          Button,
          Title,
          Text,
        },
      },
    });
  };

  it("正しくレンダリングされる", () => {
    const wrapper = mountComponent({
      difficultyName: "Easy",
      rankings: mockRankings,
      ranking: 1
    });
    expect(wrapper.findComponent(BaseCard).exists()).toBe(true);
  });

//   it("ランキングリストが正しく表示される", () => {
//     const wrapper = mountComponent({
//       difficultyName: "Hard",
//       rankings: mockRankings,
//       ranking: 1
//     });
//     const rankingItems = wrapper.findAll(".ranking-item");
//     expect(rankingItems).toHaveLength(5);

//     rankingItems.forEach((item, index) => {
//       const text = item.findComponent(Text);
//       expect(text.text()).toContain(`${index + 1}位`);
//       expect(text.text()).toContain(mockRankings[index].username);
//       expect(text.text()).toContain(mockRankings[index].score.toString());
//     });
//   });

//   it("ランキングデータが不足している場合、適切なメッセージが表示される", () => {
//     const incompleteRankings: RankingItem[] = [
//       { user_id: "1", username: "User1", score: 100 },
//       { user_id: "2", username: "User2", score: 90 },
//     ];
//     const wrapper = mountComponent({
//       difficultyName: "Expert",
//       rankings: incompleteRankings,
//       ranking: 1
//     });
//     const rankingItems = wrapper.findAll(".ranking-item");

//     expect(rankingItems).toHaveLength(5);
//     expect(rankingItems[2].text()).toContain("データがありません");
//     expect(rankingItems[3].text()).toContain("データがありません");
//     expect(rankingItems[4].text()).toContain("データがありません");
//   });

//   it("「もっと見る」ボタンが存在する", () => {
//     const wrapper = mountComponent({
//       difficultyName: "Easy",
//       rankings: mockRankings,
//       ranking: 1
//     });
//     const button = wrapper.findComponent(Button);
//     expect(button.exists()).toBe(true);
//     expect(button.props("buttonText")).toBe("もっと見る");
//   });

//   it("ネストされたランキングデータを正しく処理する", () => {
//     const nestedRankings: RankingItem[][] = [mockRankings];
//     const wrapper = mountComponent({
//       difficultyName: "Nested",
//       rankings: nestedRankings,
//       ranking: 1
//     });
//     const rankingItems = wrapper.findAll(".ranking-item");
//     expect(rankingItems).toHaveLength(5);

//     rankingItems.forEach((item, index) => {
//       const text = item.findComponent(Text);
//       expect(text.text()).toContain(`${index + 1}位`);
//       expect(text.text()).toContain(mockRankings[index].username);
//       expect(text.text()).toContain(mockRankings[index].score.toString());
//     });
//   });
});
