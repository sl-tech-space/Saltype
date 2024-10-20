import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import HomeCard from "~/components/organisms/home/HomeCard.vue";
import GameSettingCard from "~/components/molecules/home/GameSettingCard.vue";
import MenuCard from "~/components/molecules/home/MenuCard.vue";

describe("HomeCard", () => {
  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mount(HomeCard, {
      global: {
        stubs: {
          GameSettingCard: true,
          MenuCard: true,
        },
      },
    });

    expect(wrapper.find(".home-card").exists()).toBe(true);

    const leftCard = wrapper.find(".left-card");
    const rightCard = wrapper.find(".right-card");
    expect(leftCard.exists()).toBe(true);
    expect(rightCard.exists()).toBe(true);

    expect(leftCard.findComponent(GameSettingCard).exists()).toBe(true);

    expect(rightCard.findComponent(MenuCard).exists()).toBe(true);
  });
});
