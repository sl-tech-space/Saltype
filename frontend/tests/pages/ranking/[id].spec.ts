import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick } from "vue";
import RankingDetail from "../../../pages/ranking/[id].vue";
import RankingHeader from "../../../components/organisms/ranking/RankingHeader.vue";
import BaseRankingCard from "../../../components/molecules/ranking/BaseRankingCard.vue";
import { useRanking } from "../../../composables/ranking/useRanking";

// useRankingのモック
vi.mock("../../../composables/ranking/useRanking", () => ({
  useRanking: vi.fn(),
}));

// useRouteのモック
vi.mock("#imports", () => ({
  useRoute: () => ({
    params: {
      id: "1",
    },
  }),
  useHead: vi.fn(),
}));

describe("RankingDetail", () => {
  const mockRankingDetails = [
    { id: 1, score: 100, username: "user1" },
    { id: 2, score: 90, username: "user2" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // useRankingのモックを設定
    // @ts-ignore
    vi.mocked(useRanking).mockReturnValue({
      rankingDetails: { value: mockRankingDetails },
      detailsTitle: { value: "初級" },
      getRankingDetailsByIdAndLimitParam: vi.fn(),
    });
  });

  it("正しくレンダリングされること", () => {
    const wrapper = mount(RankingDetail, {
      shallow: true,
    });

    // 必要なコンポーネントが存在することを確認
    expect(wrapper.findComponent(RankingHeader).exists()).toBe(true);
    expect(wrapper.findComponent(BaseRankingCard).exists()).toBe(true);

    // ページのルート要素が正しいクラスを持つことを確認
    expect(wrapper.classes()).toContain("page");
  });

  it("RankingHeaderに正しいプロパティが渡されること", () => {
    const wrapper = mount(RankingDetail, {
      shallow: true,
    });

    const header = wrapper.findComponent(RankingHeader);
    expect(header.props("title")).toBe("ランキング詳細");
    expect(header.props("backName")).toBe("ranking");
  });

  it("BaseRankingCardに正しいプロパティが渡されること", () => {
    const wrapper = mount(RankingDetail, {
      shallow: true,
    });

    const card = wrapper.findComponent(BaseRankingCard);
    expect(card.props()).toEqual({
      difficultyName: { value: "初級" },
      rankings: { value: mockRankingDetails },
      width: "full",
      height: "large",
      size: "large",
      limit: 21,
      isFooter: false,
      isGrid: true,
      id: undefined,
    });
  });
});
