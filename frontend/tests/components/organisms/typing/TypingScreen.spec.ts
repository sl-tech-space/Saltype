import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import TypingScreen from "~/components/organisms/typing/TypingScreen.vue";
import JpTyping from "~/components/molecules/typing/JpTyping.vue";
import EngTyping from "~/components/molecules/typing/EngTyping.vue";
import Keyboard from "~/components/molecules/typing/layout/Keyboard.vue";

// useRouteのモックを作成
const mockUseRoute = vi.fn();

// useRouteのモック
vi.mock("vue-router", () => ({
  useRoute: () => mockUseRoute(),
}));

describe("TypingScreen", () => {
  beforeEach(() => {
    // useRouteのモックをリセット
    mockUseRoute.mockReset();
  });

//   it("日本語タイピングが表示される（language=1の場合）", async () => {
//     mockUseRoute.mockReturnValue({
//       query: { language: "1" },
//     });

//     const wrapper = mount(TypingScreen);
    
//     await flushPromises();
    
//     expect(wrapper.findComponent(JpTyping).exists()).toBe(true);
//     expect(wrapper.findComponent(EngTyping).exists()).toBe(false);
//     expect(wrapper.findComponent(Keyboard).exists()).toBe(true);
//   });

  it("英語タイピングが表示される（languageが1以外の場合）", async () => {
    mockUseRoute.mockReturnValue({
      query: { language: "2" },
    });

    const wrapper = mount(TypingScreen);

    await flushPromises();

    expect(wrapper.findComponent(JpTyping).exists()).toBe(false);
    expect(wrapper.findComponent(EngTyping).exists()).toBe(true);
    expect(wrapper.findComponent(Keyboard).exists()).toBe(true);
  });

  it("英語タイピングが表示される（languageが指定されていない場合）", async () => {
    mockUseRoute.mockReturnValue({
      query: {},
    });

    const wrapper = mount(TypingScreen);

    await flushPromises();

    expect(wrapper.findComponent(JpTyping).exists()).toBe(false);
    expect(wrapper.findComponent(EngTyping).exists()).toBe(true);
    expect(wrapper.findComponent(Keyboard).exists()).toBe(true);
  });
});
