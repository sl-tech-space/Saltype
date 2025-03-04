import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import TypingStats from "../../../../components/molecules/typing/TypingStats.vue";
import Text from "../../../../components/atoms/texts/Text.vue";

describe("TypingStats", () => {
  let wrapper: VueWrapper<any>;
  let localStorageMock: { [key: string]: string };
  const mockBus = {
    $on: vi.fn(),
    $off: vi.fn(),
  };

  beforeEach(() => {
    localStorageMock = {};
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn((key) => localStorageMock[key] || null),
        setItem: vi.fn((key, value) => {
          localStorageMock[key] = value.toString();
        }),
      },
      writable: true,
    });

    vi.mock("#app", () => ({
      useNuxtApp: () => ({
        $bus: mockBus,
      }),
    }));
  });

  const mountComponent = () => {
    return mount(TypingStats, {
      global: {
        components: {
          Text,
        },
      },
    });
  };

  it("タイピング統計が正しく更新される", async () => {
    localStorageMock["showTypingDetails"] = "true";
    wrapper = mountComponent();

    const stats = {
      totalCorrectTypedCount: 10,
      totalMistypedCount: 2,
      typingAccuracy: 0.833,
    };

    await wrapper.vm.updateTypingStats(stats);

    const texts = wrapper.findAllComponents(Text);
    expect(texts[0].props("text")).toBe("正タイプ数: 10");
    expect(texts[1].props("text")).toBe("ミスタイプ数: 2");
    expect(texts[2].props("text")).toBe("タイピング精度: 83.3%");
  });
});
