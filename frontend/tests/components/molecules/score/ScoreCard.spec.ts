import { describe, it, expect } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import ScoreCard from "../../../../components/molecules/score/ScoreCard.vue";
import BaseCard from "../../../../components/molecules/common/BaseCard.vue";
import Title from "../../../../components/atoms/texts/Title.vue";

describe("ScoreCard", () => {
  let wrapper: VueWrapper<any>;

  const createWrapper = (props = {}) => {
    return mount(ScoreCard, {
      props: {
        yourTotalScore: 1000,
        yourAverageScore: 800,
        ...props,
      },
      global: {
        components: {
          BaseCard,
          Title,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    wrapper = createWrapper();
    expect(wrapper.findComponent(BaseCard).exists()).toBe(true);
  });

  it("ヘッダーに正しいタイトルが表示される", () => {
    wrapper = createWrapper();
    const headerTitle = wrapper.findComponent({
      name: "Title",
      props: { size: "small" },
    });
    expect(headerTitle.props("text")).toBe("今回のスコア : 1000");
  });

  it("プロップスで渡されたスコアが正しく表示される", () => {
    const totalScore = 1500;
    const averageScore = 1200.5;
    wrapper = createWrapper({
      yourTotalScore: totalScore,
      yourAverageScore: averageScore,
    });

    const bodyContent = wrapper.find(".body-content");
    expect(bodyContent.text()).toContain(`今回のスコア : ${totalScore}`);
    expect(bodyContent.text()).toContain(
      `各設定の平均スコア : ${averageScore.toFixed(0)}`
    );
  });

  it("平均スコアが小数点以下を切り捨てて表示される", () => {
    const averageScore = 1234.56;
    wrapper = createWrapper({ yourAverageScore: averageScore });

    const bodyContent = wrapper.find(".body-content");
    expect(bodyContent.text()).toContain(`今回のスコア : 1000各設定の平均スコア : 1235`);
  });

  it("スコアが0の場合も正しく表示される", () => {
    wrapper = createWrapper({ yourTotalScore: 0, yourAverageScore: 0 });

    const bodyContent = wrapper.find(".body-content");
    expect(bodyContent.text()).toContain("今回のスコア : 0");
    expect(bodyContent.text()).toContain("各設定の平均スコア : 0");
  });
});
