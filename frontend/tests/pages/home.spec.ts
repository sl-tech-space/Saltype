import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import HomePage from "~/pages/home.vue";
import CursorEffect from "~/components/molecules/common/ui/CursorEffect.vue";
import HomeHeader from "~/components/organisms/home/HomeHeader.vue";
import HomeCard from "~/components/organisms/home/HomeCard.vue";

describe("HomePage", () => {
  it("正しくレンダリングされること", () => {
    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          CursorEffect: true,
          HomeHeader: true,
          HomeCard: true,
        },
      },
    });

    // 各コンポーネントが存在することを確認
    expect(wrapper.findComponent(CursorEffect).exists()).toBe(true);
    expect(wrapper.findComponent(HomeHeader).exists()).toBe(true);
    expect(wrapper.findComponent(HomeCard).exists()).toBe(true);

    // pageクラスを持つdiv要素が存在することを確認
    expect(wrapper.find(".page").exists()).toBe(true);
  });
});
