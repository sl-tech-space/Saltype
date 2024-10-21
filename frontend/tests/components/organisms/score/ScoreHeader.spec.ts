import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ScoreHeader from "~/components/organisms/score/ScoreHeader.vue";
import BaseHeader from "~/components/molecules/common/BaseHeader.vue";
import Title from "~/components/atoms/texts/Title.vue";

describe("ScoreHeader", () => {
  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mount(ScoreHeader);

    const baseHeader = wrapper.findComponent(BaseHeader);
    expect(baseHeader.exists()).toBe(true);

    expect(baseHeader.props("title")).toBe("タイピング結果");

    const title = wrapper.findComponent(Title);
    expect(title.exists()).toBe(true);

    expect(title.props("size")).toBe("small");
    expect(title.props("color")).toBe("white");
    expect(title.props("text")).toBe("スコアボード");

    const headerLeftSlot = baseHeader.find(".header-left");
    expect(headerLeftSlot.exists()).toBe(true);
    expect(headerLeftSlot.findComponent(Title).exists()).toBe(true);
  });
});
