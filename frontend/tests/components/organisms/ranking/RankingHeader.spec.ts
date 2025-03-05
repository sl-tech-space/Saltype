import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import RankingHeader from "../../../../components/organisms/ranking/RankingHeader.vue";
import BaseHeader from "../../../../components/molecules/common/BaseHeader.vue";

describe("RankingHeader", () => {
  const mountComponent = (
    props: { title: string; backName?: string } = { title: "テストタイトル" }
  ) => {
    return mount(RankingHeader, {
      props,
      global: {
        components: {
          BaseHeader,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent(BaseHeader).exists()).toBe(true);
  });

  it("タイトルが正しく渡される", () => {
    const title = "テストタイトル";
    const wrapper = mountComponent({ title });
    const baseHeader = wrapper.findComponent(BaseHeader);
    expect(baseHeader.props("title")).toBe(title);
  });

  it("戻るボタンの名前が正しく渡される", () => {
    const backName = "戻る";
    const wrapper = mountComponent({
      title: "テストタイトル",
      backName: backName,
    });
    const baseHeader = wrapper.findComponent(BaseHeader);
    expect(baseHeader.props("onBackClick")).toBe(backName);
  });
});
