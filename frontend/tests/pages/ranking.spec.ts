import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import RankingPage from "~/pages/ranking.vue";
import CursorEffect from "~/components/molecules/common/ui/CursorEffect.vue";
import ScrollHandler from "~/components/molecules/common/ui/ScrollHandler.vue";
import RankingHeader from "~/components/organisms/ranking/RankingHeader.vue";
import JapaneseRankingCard from "~/components/organisms/ranking/JapaneseRankingCard.vue";
import EnglishRankingCard from "~/components/organisms/ranking/EnglishRankingCard.vue";
import Loading from "~/components/molecules/common/ui/Loading.vue";

// useRankingのモック
vi.mock("~/composables/ranking/useRanking", () => ({
  useRanking: () => ({
    isLoading: false,
    japaneseRankings: [],
    englishRankings: [],
    getRankingByLimitParam: vi.fn(),
  }),
}));

describe("RankingPage", () => {
  it("正しくレンダリングされること", async () => {
    const wrapper = mount(RankingPage, {
      global: {
        stubs: {
          CursorEffect: true,
          ScrollHandler: true,
          RankingHeader: true,
          JapaneseRankingCard: true,
          EnglishRankingCard: true,
          Loading: true,
        },
      },
    });

    // 各コンポーネントが存在することを確認
    expect(wrapper.findComponent(CursorEffect).exists()).toBe(true);
    expect(wrapper.findComponent(ScrollHandler).exists()).toBe(true);
    expect(wrapper.findAllComponents(RankingHeader).length).toBe(3);
    expect(wrapper.findComponent(JapaneseRankingCard).exists()).toBe(true);
    expect(wrapper.findComponent(EnglishRankingCard).exists()).toBe(true);
    expect(wrapper.findComponent(Loading).exists()).toBe(true);

    // pageクラスとsecond-pageクラスを持つdiv要素が存在することを確認
    expect(wrapper.find(".page").exists()).toBe(true);
    expect(wrapper.findAll(".second-page").length).toBe(2);

    // RankingHeaderのタイトルを確認
    const headers = wrapper.findAllComponents(RankingHeader);
    expect(headers[0].props("title")).toBe("ランキング");
    expect(headers[1].props("title")).toBe("日本語");
    expect(headers[2].props("title")).toBe("英語");
  });
});
