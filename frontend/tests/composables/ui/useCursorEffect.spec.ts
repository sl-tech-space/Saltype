import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import CursorComponent from "~/composables/ui/useCursorEffect.vue";

describe("CursorComponent", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(CursorComponent);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("コンポーネントが正しくレンダリングされるか", () => {
    expect(wrapper.find(".cursor").exists()).toBe(true);
  });

  it("マウスの移動に応じてカーソルの位置が更新されるか", async () => {
    const mockEvent = { clientX: 100, clientY: 200 };
    window.dispatchEvent(new MouseEvent("mousemove", mockEvent));

    await nextTick();

    const cursorElement = wrapper.find(".cursor").element;
    expect(cursorElement.style.transform).toBe("translate(100px, 200px)");
  });

  it("イベントリスナーが正しく追加・削除されるか", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const wrapper = mount(CursorComponent);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function)
    );

    wrapper.unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it("スロットのコンテンツが正しくレンダリングされるか", () => {
    const wrapper = mount(CursorComponent, {
      slots: {
        default: '<div class="slot-content">Slot Content</div>',
      },
    });
    expect(wrapper.find(".slot-content").exists()).toBe(true);
    expect(wrapper.find(".slot-content").text()).toBe("Slot Content");
  });
});
