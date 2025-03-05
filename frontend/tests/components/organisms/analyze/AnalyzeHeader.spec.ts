import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AnalyzeHeader from "../../../../components/organisms/analyze/AnalyzeHeader.vue";
import BaseHeader from "../../../../components/molecules/common/BaseHeader.vue";

describe("AnalyzeHeader", () => {
  const mountComponent = () => {
    return mount(AnalyzeHeader, {
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

  it("BaseHeaderに正しいタイトルが渡される", () => {
    const wrapper = mountComponent();
    const baseHeader = wrapper.findComponent(BaseHeader);
    expect(baseHeader.props("title")).toBe("分析情報");
  });
});
