import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ScoreCard from "~/components/molecules/score/ScoreCard.vue";
import BaseCard from "~/components/molecules/common/BaseCard.vue";
import BaseModal from "~/components/molecules/common/BaseModal.vue";
import Title from "~/components/atoms/texts/Title.vue";
import Text from "~/components/atoms/texts/Text.vue";
import Button from "~/components/atoms/buttons/Button.vue";

describe("ScoreCard", () => {
  const defaultProps = {
    yourTotalScore: 500,
    yourAverageScore: 100,
  };

  const mountComponent = (props = {}) => {
    return mount(ScoreCard, {
      props: { ...defaultProps, ...props },
      global: {
        components: {
          BaseCard,
          BaseModal,
          Title,
          Text,
          Button,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent(BaseCard).exists()).toBe(true);
  });

  it("プロップスで渡されたスコアが正しく表示される", async () => {
    const wrapper = mountComponent({
      yourTotalScore: 600,
      yourAverageScore: 120,
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("600");
    expect(wrapper.text()).toContain("120");
  });
});
