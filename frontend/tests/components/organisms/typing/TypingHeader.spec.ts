import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TypingHeader from "~/components/organisms/typing/TypingHeader.vue";
import BaseHeader from "~/components/molecules/common/BaseHeader.vue";
import Title from "~/components/atoms/texts/Title.vue";
import Timer from "~/components/molecules/typing/Timer.vue";

describe("TypingHeader", () => {
  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mount(TypingHeader);

    const baseHeader = wrapper.findComponent(BaseHeader);
    expect(baseHeader.exists()).toBe(true);

    const headerLeftSlot = baseHeader.find(".header-left");
    expect(headerLeftSlot.exists()).toBe(true);

    const title = headerLeftSlot.findComponent(Title);
    expect(title.exists()).toBe(true);
    expect(title.props("size")).toBe("small");
    expect(title.props("color")).toBe("white");
    expect(title.props("text")).toBe("タイピング");

    const headerCenterSlot = baseHeader.find(".header-center");
    expect(headerCenterSlot.exists()).toBe(true);

    const timer = headerCenterSlot.findComponent(Timer);
    expect(timer.exists()).toBe(true);
  });
});
