import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ScoreHeader from "../../../../components/organisms/score/ScoreHeader.vue";
import BaseHeader from "../../../../components/molecules/common/BaseHeader.vue";
import Title from "../../../../components/atoms/texts/Title.vue";

describe("ScoreHeader", () => {
  const mountComponent = () => {
    return mount(ScoreHeader, {
      global: {
        components: {
          BaseHeader,
          Title,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent(BaseHeader).exists()).toBe(true);
  });

  it("BaseHeaderに正しいタイトルが渡される", () => {
    const wrapper = mountComponent();
    const baseHeader = wrapper.findComponent(BaseHeader);
    expect(baseHeader.props("title")).toBe("タイピング結果");
  });

  it("スコアボードのタイトルが正しく表示される", () => {
    const wrapper = mountComponent();
    const title = wrapper.findComponent(Title);
    
    expect(title.props()).toEqual({
      size: "small",
      color: "white",
      text: "スコアボード",
    });
  });

  it("タイトルが左側のスロットに配置される", () => {
    const wrapper = mountComponent();
    const headerLeftSlot = wrapper.find(".header-left");
    
    expect(headerLeftSlot.exists()).toBe(true);
    expect(headerLeftSlot.findComponent(Title).exists()).toBe(true);
  });
});
