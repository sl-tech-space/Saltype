import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import ScrollComponent from "~/components/molecules/common/ui/ScrollHandler.vue";

describe("スクロールコンポーネント", () => {
  let wrapper: any;

  beforeEach(() => {
    // window.innerHeightのモック
    Object.defineProperty(window, "innerHeight", {
      value: 1000,
      writable: true,
    });

    // window.scrollByのモック
    window.scrollBy = vi.fn();

    wrapper = mount(ScrollComponent);
  });

  afterEach(() => {
    wrapper.unmount();
    vi.restoreAllMocks();
  });

  it("コンポーネントが正しくマウントされる", () => {
    expect(wrapper.find(".content").exists()).toBe(true);
  });

  it("マウント時にbodyのoverflowがhiddenに設定される", () => {
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("アンマウント時にbodyのoverflowが元に戻る", () => {
    wrapper.unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("下スクロール時に正しく動作する", async () => {
    const wheelEvent = new WheelEvent("wheel", { deltaY: 100 });
    window.dispatchEvent(wheelEvent);

    await nextTick();

    expect(window.scrollBy).toHaveBeenCalledWith({
      top: 1000,
      behavior: "smooth",
    });
  });

  it("上スクロール時に正しく動作する", async () => {
    const wheelEvent = new WheelEvent("wheel", { deltaY: -100 });
    window.dispatchEvent(wheelEvent);

    await nextTick();

    expect(window.scrollBy).toHaveBeenCalledWith({
      top: -1000,
      behavior: "smooth",
    });
  });

  it("スクロール後にイベントリスナーが再追加される", async () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    const wheelEvent = new WheelEvent("wheel", { deltaY: 100 });
    window.dispatchEvent(wheelEvent);

    await nextTick();

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "wheel",
      expect.any(Function),
      { once: true }
    );
  });

  it("スロットコンテンツが正しくレンダリングされる", () => {
    const wrapper = mount(ScrollComponent, {
      slots: {
        default: '<div class="test-content">Test Content</div>',
      },
    });
    expect(wrapper.find(".test-content").exists()).toBe(true);
    expect(wrapper.find(".test-content").text()).toBe("Test Content");
  });
});
