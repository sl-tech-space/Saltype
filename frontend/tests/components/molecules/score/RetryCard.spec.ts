import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import RetryCard from "../../../../components/molecules/score/RetryCard.vue";
import BaseCard from "../../../../components/molecules/common/BaseCard.vue";
import Title from "../../../../components/atoms/texts/Title.vue";
import Text from "../../../../components/atoms/texts/Text.vue";
import Button from "../../../../components/atoms/buttons/Button.vue";

const mockNavigateTo = vi.fn();
vi.mock('#app', () => ({
  navigateTo: mockNavigateTo
}));

describe("RetryCard", () => {
  let wrapper: VueWrapper<any>;

  const mountComponent = (props = { id: '1-2' }) => {
    return mount(RetryCard, {
      props,
      global: {
        components: {
          BaseCard,
          Title,
          Text,
          Button,
        }
      }
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    wrapper = mountComponent();
    expect(wrapper.findComponent(BaseCard).exists()).toBe(true);
  });

  it("IDが存在する場合、言語と難易度が正しく表示される", async () => {
    wrapper = mountComponent({ id: '1-2' });
    await nextTick();

    expect(wrapper.text()).toContain("リトライ 現在の設定 言語: 日本語 難易度: ノーマルスタート");
  });

  it("IDが存在しない場合、適切なメッセージを表示する", async () => {
    wrapper = mountComponent({ id: '' });
    await nextTick();

    expect(wrapper.text()).toContain("言語: データが存在しません");
    expect(wrapper.text()).toContain("難易度: データが存在しません");
  });
});
