import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import HomeCard from "../../../../components/organisms/home/HomeCard.vue";
import GameSettingCard from "../../../../components/molecules/home/GameSettingCard.vue";
import MenuCard from "../../../../components/molecules/home/MenuCard.vue";

describe("HomeCard", () => {
  const mountComponent = () => {
    return mount(HomeCard, {
      global: {
        stubs: {
          GameSettingCard: true,
          MenuCard: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mountComponent();
    expect(wrapper.find(".home-card").exists()).toBe(true);
  });

  it("左右のカードが正しく配置される", () => {
    const wrapper = mountComponent();
    const leftCard = wrapper.find(".left-card");
    const rightCard = wrapper.find(".right-card");

    expect(leftCard.exists()).toBe(true);
    expect(rightCard.exists()).toBe(true);
  });

  it("GameSettingCardが左側に配置される", () => {
    const wrapper = mountComponent();
    const leftCard = wrapper.find(".left-card");
    expect(leftCard.findComponent({ name: "GameSettingCard" }).exists()).toBe(true);
  });

  it("MenuCardが右側に配置される", () => {
    const wrapper = mountComponent();
    const rightCard = wrapper.find(".right-card");
    expect(rightCard.findComponent({ name: "MenuCard" }).exists()).toBe(true);
  });
});
