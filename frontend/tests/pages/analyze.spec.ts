import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AnalyzePage from "~/pages/analyze.vue";
import CursorEffect from "~/composables/ui/useCursorEffect.vue";
import AnalyzeHeader from "~/components/organisms/analyze/AnalyzeHeader.vue";
import AnalyzeCard from "~/components/organisms/analyze/AnalyzeCard.vue";

describe("AnalyzePage", () => {

  it("正しくレンダリングされること", () => {
    const wrapper = mount(AnalyzePage, {
      global: {
        stubs: {
          CursorEffect: true,
          AnalyzeHeader: true,
          AnalyzeCard: true,
        },
      },
    });

    expect(wrapper.findComponent(CursorEffect).exists()).toBe(true);
    expect(wrapper.findComponent(AnalyzeHeader).exists()).toBe(true);
    expect(wrapper.findComponent(AnalyzeCard).exists()).toBe(true);
  });
});
