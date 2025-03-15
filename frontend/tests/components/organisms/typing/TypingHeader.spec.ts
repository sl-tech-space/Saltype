import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TypingHeader from "../../../../components/organisms/typing/TypingHeader.vue";
import BaseHeader from "../../../../components/molecules/common/BaseHeader.vue";
import Title from "../../../../components/atoms/texts/Title.vue";

describe("TypingHeader", () => {
  const mountComponent = () => {
    return mount(TypingHeader, {
      global: {
        components: {
          BaseHeader,
          Title,
        },
        stubs: {
          Timer: true,
          TypingStats: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent(BaseHeader).exists()).toBe(true);
  });

  it("左側のスロットにタイトルが正しく表示される", () => {
    const wrapper = mountComponent();
    const headerLeftSlot = wrapper.find(".header-left");
    const title = headerLeftSlot.findComponent(Title);

    expect(title.props()).toEqual({
      size: "small",
      color: "white",
      text: "タイピング",
    });
  });

  it("中央のスロットにタイピング情報が表示される", () => {
    const wrapper = mountComponent();
    const headerCenterSlot = wrapper.find(".header-center");
    const typingEvent = headerCenterSlot.find(".typing-event");

    expect(typingEvent.exists()).toBe(true);
    expect(typingEvent.findComponent({ name: "TypingStats" }).exists()).toBe(
      true
    );
    expect(typingEvent.findComponent({ name: "Timer" }).exists()).toBe(true);
  });
});
