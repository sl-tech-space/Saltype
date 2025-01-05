import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TypingPage from "~/pages/typing/[id].vue";
import CursorEffect from "~/components/molecules/common/ui/CursorEffect.vue";
import TypingHeader from "~/components/organisms/typing/TypingHeader.vue";
import TypingScreen from "~/components/organisms/typing/TypingScreen.vue";

describe("TypingPage", () => {
  it("正しくレンダリングされること", () => {
    const wrapper = mount(TypingPage, {
      global: {
        stubs: {
          CursorEffect: true,
          TypingHeader: true,
          TypingScreen: true,
        },
      },
    });

    // 各コンポーネントが存在することを確認
    expect(wrapper.findComponent(CursorEffect).exists()).toBe(true);
    expect(wrapper.findComponent(TypingHeader).exists()).toBe(true);
    expect(wrapper.findComponent(TypingScreen).exists()).toBe(true);

    // pageクラスを持つdiv要素が存在することを確認
    expect(wrapper.find(".page").exists()).toBe(true);

    // pageクラスを持つdiv要素の中にTypingHeaderとTypingScreenが存在することを確認
    const pageDiv = wrapper.find(".page");
    expect(pageDiv.findComponent(TypingHeader).exists()).toBe(true);
    expect(pageDiv.findComponent(TypingScreen).exists()).toBe(true);
  });
});
