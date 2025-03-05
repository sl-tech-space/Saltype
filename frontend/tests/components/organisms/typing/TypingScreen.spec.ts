import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import TypingScreen from "../../../../components/organisms/typing/TypingScreen.vue";

const mockRoute = {
  params: {},
  query: {},
};

vi.mock("vue-router", () => ({
  useRoute: () => mockRoute,
}));

describe("TypingScreen", () => {
  beforeEach(() => {
    mockRoute.params = {};
  });

  const mountComponent = () => {
    return mount(TypingScreen, {
      global: {
        stubs: {
          TypingScreen: true,
          AITypingScreen: true,
          Keyboard: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mountComponent();
    expect(wrapper.find(".typing-screen").exists()).toBe(true);
  });

  it("通常モードでは標準のタイピング画面が表示される", () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent({ name: "TypingScreen" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "AITypingScreen" }).exists()).toBe(
      false
    );
    expect(wrapper.findComponent({ name: "Keyboard" }).exists()).toBe(true);
  });
});
