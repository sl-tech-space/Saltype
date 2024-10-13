import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AnalyzeHeader from "~/components/organisms/analyze/AnalyzeHeader.vue";
import BaseHeader from "~/components/molecules/common/BaseHeader.vue";

describe("AnalyzeHeader", () => {
  it("BaseHeaderコンポーネントが正しくレンダリングされ、適切なプロップが渡される", () => {
    const wrapper = mount(AnalyzeHeader);

    const baseHeader = wrapper.findComponent(BaseHeader);
    expect(baseHeader.exists()).toBe(true);

    expect(baseHeader.props("title")).toBe("分析情報");
  });
});
