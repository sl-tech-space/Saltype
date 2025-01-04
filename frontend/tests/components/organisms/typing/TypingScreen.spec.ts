import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import TypingScreenInOrganisms from "~/components/organisms/typing/TypingScreen.vue";
import TypingScreenInMolecules from "~/components/molecules/typing/TypingScreen.vue";
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

  it("英語タイピングが表示される（languageが1以外の場合）", async () => {
    mockUseRoute.mockReturnValue({
      query: { language: "2" },
    });

    const wrapper = mount(TypingScreenInOrganisms);

    await flushPromises();

    expect(wrapper.findComponent(TypingScreenInMolecules).exists()).toBe(true);
    expect(wrapper.findComponent(Keyboard).exists()).toBe(true);
  });

  it("英語タイピングが表示される（languageが指定されていない場合）", async () => {
    mockUseRoute.mockReturnValue({
      query: {},
    });

    const wrapper = mount(TypingScreenInOrganisms);

    await flushPromises();

    expect(wrapper.findComponent(TypingScreenInMolecules).exists()).toBe(true);
    expect(wrapper.findComponent(Keyboard).exists()).toBe(true);
  });
});
