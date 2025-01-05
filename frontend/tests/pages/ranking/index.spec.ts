import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RankingPage from "~/pages/ranking/index.vue";
import CursorEffect from "~/components/molecules/common/ui/CursorEffect.vue";
import ScrollHandler from "~/components/molecules/common/ui/ScrollHandler.vue";
import RankingHeader from "~/components/organisms/ranking/RankingHeader.vue";
import JapaneseRankingCard from "~/components/organisms/ranking/JapaneseRankingCard.vue";
import EnglishRankingCard from "~/components/organisms/ranking/EnglishRankingCard.vue";
import DailyRankingCard from "~/components/organisms/ranking/DailyRankingCard.vue";
import Loading from "~/components/molecules/common/ui/Loading.vue";
import BaseNotification from "~/components/molecules/common/BaseNotification.vue";
import PageIndicator from "~/components/molecules/common/ui/PageIndicator.vue";
import CopyRight from "~/components/atoms/ui/CopyRight.vue";

vi.mock("~/composables/ranking/useRanking", () => ({
  useRanking: () => ({
    isLoading: false,
    error: null,
    dailyJapaneseRankings: [],
    dailyEnglishRankings: [],
    japaneseRankings: [],
    englishRankings: [],
    getRankingByLimitParam: vi.fn(),
    getDailyRankingByLimitParam: vi.fn(),
  }),
}));

vi.mock("~/composables/common/useError", () => ({
  useErrorNotification: () => ({
    showErrorNotification: false,
  }),
}));

describe("RankingPage", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(RankingPage, {
      global: {
        stubs: {
          CursorEffect: true,
          ScrollHandler: true,
          RankingHeader: true,
          JapaneseRankingCard: true,
          EnglishRankingCard: true,
          DailyRankingCard: true,
          Loading: true,
          BaseNotification: true,
          PageIndicator: true,
          CopyRight: true,
        },
        mocks: {
          useHead: vi.fn(),
        },
      },
    });
  });

  it("コンポーネントが正しくレンダリングされること", () => {
    expect(wrapper.findComponent(ScrollHandler).exists()).toBe(true);
    expect(wrapper.findComponent(PageIndicator).exists()).toBe(true);
    expect(wrapper.findAllComponents(RankingHeader).length).toBe(3);
    expect(wrapper.findComponent(DailyRankingCard).exists()).toBe(true);
    expect(wrapper.findComponent(JapaneseRankingCard).exists()).toBe(true);
    expect(wrapper.findComponent(EnglishRankingCard).exists()).toBe(true);
    expect(wrapper.findComponent(Loading).exists()).toBe(true);
    expect(wrapper.findComponent(CopyRight).exists()).toBe(true);
  });

  it("RankingHeaderに正しいタイトルが渡されること", () => {
    const headers = wrapper.findAllComponents(RankingHeader);
    expect(headers[0].props("title")).toBe("ランキング<br>本日のチャンピオン");
    expect(headers[1].props("title")).toBe("ランキング<br>日本語");
    expect(headers[2].props("title")).toBe("ランキング<br>英語");
  });

  it("ランキングカードに正しいプロップが渡されること", () => {
    const dailyRankingCard = wrapper.findComponent(DailyRankingCard);
    expect(dailyRankingCard.props("dailyRankingDataLimit")).toBe(1);

    const japaneseRankingCard = wrapper.findComponent(JapaneseRankingCard);
    expect(japaneseRankingCard.props("rankingDataLimit")).toBe(5);

    const englishRankingCard = wrapper.findComponent(EnglishRankingCard);
    expect(englishRankingCard.props("rankingDataLimit")).toBe(5);
  });

  it("エラーがない場合、BaseNotificationが表示されないこと", () => {
    expect(wrapper.findComponent(BaseNotification).exists()).toBe(false);
  });
});
