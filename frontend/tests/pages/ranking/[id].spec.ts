import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import RankingDetails from "~/pages/ranking/[id].vue";
import RankingHeader from "~/components/organisms/ranking/RankingHeader.vue";
import BaseRankingCard from "~/components/molecules/ranking/BaseRankingCard.vue";
import CopyRight from "~/components/atoms/ui/CopyRight.vue";

vi.mock("~/composables/ranking/useRanking", () => ({
  useRanking: () => ({
    rankingDetails: [],
    detailsTitle: "テストランキング",
    getRankingDetailsByIdAndLimitParam: vi.fn(),
  }),
}));

vi.mock("vue-router", () => ({
  useRoute: () => ({
    params: { id: "1" },
  }),
}));

vi.mock("nuxt/app", () => ({
  useHead: vi.fn(),
}));

describe("RankingDetails", () => {
  const createWrapper = () => {
    return mount(RankingDetails, {
      global: {
        stubs: {
          RankingHeader: true,
          BaseRankingCard: true,
          CopyRight: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされること", () => {
    const wrapper = createWrapper();
    expect(wrapper.find(".page").exists()).toBe(true);
    expect(wrapper.findComponent(RankingHeader).exists()).toBe(true);
    expect(wrapper.findComponent(BaseRankingCard).exists()).toBe(true);
    expect(wrapper.findComponent(CopyRight).exists()).toBe(true);
  });

  it("RankingHeaderに正しいプロパティが渡されること", () => {
    const wrapper = createWrapper();
    const rankingHeader = wrapper.findComponent(RankingHeader);
    expect(rankingHeader.props("title")).toBe("ランキング詳細");
    expect(rankingHeader.props("backName")).toBe("ranking");
  });

  it("BaseRankingCardに正しいプロパティが渡されること", () => {
    const wrapper = createWrapper();
    const baseRankingCard = wrapper.findComponent(BaseRankingCard);
    expect(baseRankingCard.props("difficultyName")).toBe("テストランキング");
    expect(baseRankingCard.props("rankings")).toEqual([]);
    expect(baseRankingCard.props("width")).toBe("full");
    expect(baseRankingCard.props("height")).toBe("large");
    expect(baseRankingCard.props("limit")).toBe(21);
    expect(baseRankingCard.props("isFooter")).toBe(false);
    expect(baseRankingCard.props("isGrid")).toBe(true);
  });
});
