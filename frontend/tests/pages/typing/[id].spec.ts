import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import TypingPage from "../../../pages/typing/[id].vue";
import TypingHeader from "../../../components/organisms/typing/TypingHeader.vue";
import TypingScreen from "../../../components/organisms/typing/TypingScreen.vue";

const mockUseHead = vi.fn();

// useHeadのモック
vi.mock("#imports", () => ({
  useHead: mockUseHead,
}));

describe("TypingPage", () => {
  it("正しくレンダリングされること", () => {
    const wrapper = mount(TypingPage, {
      shallow: true,
    });

    // 必要なコンポーネントが存在することを確認
    expect(wrapper.findComponent(TypingHeader).exists()).toBe(true);
    expect(wrapper.findComponent(TypingScreen).exists()).toBe(true);

    // ページのルート要素が正しいクラスを持つことを確認
    expect(wrapper.classes()).toContain("page");
  });

  it("コンポーネントの順序が正しいこと", () => {
    const wrapper = mount(TypingPage, {
      shallow: true,
    });

    const children = wrapper.element.children;
    expect(children[0].tagName.toLowerCase()).toBe("typing-header-stub");
    expect(children[1].tagName.toLowerCase()).toBe("typing-screen-stub");
  });
});
