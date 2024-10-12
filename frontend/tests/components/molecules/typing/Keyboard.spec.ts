import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import KeyboardLayout from "~/components/molecules/typing/layout/Keyboard.vue";

describe("KeyboardLayout", () => {
  let wrapper: VueWrapper<any>;
  const mockBus = {
    $on: vi.fn(),
    $off: vi.fn(),
  };

  beforeEach(() => {
    wrapper = mount(KeyboardLayout, {
      global: {
        provide: {
          $bus: mockBus,
        },
      },
    });
  });

  it("コンポーネントが正しくレンダリングされる", () => {
    expect(wrapper.find(".keyboard-layout").exists()).toBe(true);
    expect(wrapper.find(".keyboard").exists()).toBe(true);
  });

  it("正しい数のキーが表示される", () => {
    const keys = wrapper.findAll(".key");
    expect(keys.length).toBeGreaterThan(0);
  });

  it("ワイドキーが正しく表示される", () => {
    const wideKeys = wrapper.findAll(".key-wide");
    expect(wideKeys.length).toBeGreaterThan(0);
  });

  it("エクストラワイドキーが正しく表示される", () => {
    const extraWideKeys = wrapper.findAll(".key-extra-wide");
    expect(extraWideKeys.length).toBe(1); // Spaceキー
  });

  it("正しいキープレスイベントでキーが強調表示される", async () => {
    const keyPressHandler = mockBus.$on.mock.calls[0][1];
    keyPressHandler({ code: "KeyA", result: "correct" });
    await nextTick();
    expect(wrapper.find(".key-correct").text()).toBe("A");
  });

  it("不正確なキープレスイベントでキーが強調表示される", async () => {
    const keyPressHandler = mockBus.$on.mock.calls[0][1];
    keyPressHandler({ code: "KeyB", result: "incorrect" });
    await nextTick();
    expect(wrapper.find(".key-incorrect").text()).toBe("B");
  });

  it("強調表示が一定時間後に解除される", async () => {
    vi.useFakeTimers();
    const keyPressHandler = mockBus.$on.mock.calls[0][1];
    keyPressHandler({ code: "KeyC", result: "correct" });
    await nextTick();
    expect(wrapper.find(".key-correct").exists()).toBe(true);
    vi.advanceTimersByTime(200);
    await nextTick();
    expect(wrapper.find(".key-correct").exists()).toBe(false);
    vi.useRealTimers();
  });

  it("コンポーネントのアンマウント時にイベントリスナーが解除される", () => {
    wrapper.unmount();
    expect(mockBus.$off).toHaveBeenCalledWith("key-press");
  });
});
