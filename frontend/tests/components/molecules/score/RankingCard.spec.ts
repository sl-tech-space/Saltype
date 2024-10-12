import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import RankingCard from "~/components/molecules/score/RankingCard.vue";
import BaseCard from "~/components/molecules/common/BaseCard.vue";
import Title from "~/components/atoms/texts/Title.vue";
import Button from "~/components/atoms/buttons/Button.vue";

// モックルーターを作成
const mockRouter = {
  push: vi.fn(),
};

// useRouterのモック
vi.mock("vue-router", () => ({
  useRouter: () => mockRouter,
}));

describe("RankingCard", () => {
  let wrapper: VueWrapper<any>;

  const createWrapper = (props = {}) => {
    return mount(RankingCard, {
      props: {
        ranking: 1,
        ...props,
      },
      global: {
        components: {
          BaseCard,
          Title,
          Button,
        },
        mocks: {
          $router: mockRouter,
        },
      },
    });
  };

  beforeEach(() => {
    wrapper = createWrapper();
  });

  it("コンポーネントが正しくレンダリングされる", () => {
    expect(wrapper.findComponent(BaseCard).exists()).toBe(true);
  });

  it("プロップスで渡されたランキングが正しく表示される", () => {
    const ranking = 5;
    wrapper = createWrapper({ ranking });
    const rankingTitle = wrapper.findComponent({
      name: "Title",
      props: { size: "medium" },
    });
    expect(rankingTitle.props("text")).toBe(ranking.toString());
  });

  it("ヘッダーに「ランキング」というタイトルが表示される", () => {
    const headerTitle = wrapper.findComponent({
      name: "Title",
      props: { size: "small" },
    });
    expect(headerTitle.props("text")).toBe("ランキング");
  });

  it("「全体ランキングへ」ボタンが存在する", () => {
    const button = wrapper.findComponent(Button);
    expect(button.exists()).toBe(true);
    expect(button.props("buttonText")).toBe("全体ランキングへ");
  });

  it("ボタンクリックでランキングページに遷移する", async () => {
    const button = wrapper.findComponent(Button);
    await button.trigger("click");
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "ranking" });
  });
});
