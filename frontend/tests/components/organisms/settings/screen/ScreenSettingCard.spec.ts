import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import ScreenSettingCard from "../../../../../components/organisms/settings/screen/ScreenSettingCard.vue";
import MenuCard from "../../../../../components/molecules/settings/screen/MenuCard.vue";

describe("ScreenSettingCard", () => {
  const mountComponent = () => {
    return mount(ScreenSettingCard, {
      global: {
        stubs: {
          ScreenCommonSetting: true,
          TypingScreenSetting: true,
          ColorCustomizer: true,
          MenuCard: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mountComponent();
    expect(wrapper.find(".settings-card").exists()).toBe(true);
    expect(wrapper.find(".left-card").exists()).toBe(true);
    expect(wrapper.find(".right-card").exists()).toBe(true);
  });

  it("初期表示時はScreenCommonSettingが表示される", () => {
    const wrapper = mountComponent();
    expect(
      wrapper.findComponent({ name: "ScreenCommonSetting" }).exists()
    ).toBe(true);
  });

  it("カード切り替えが正しく動作する", async () => {
    const wrapper = mountComponent();

    // TypingScreenSettingに切り替え
    await wrapper
      .findComponent(MenuCard)
      .vm.$emit("change-card", "typingScreenSetting");
    await nextTick();
    expect(
      wrapper.findComponent({ name: "TypingScreenSetting" }).exists()
    ).toBe(true);

    // ColorCustomizerに切り替え
    await wrapper
      .findComponent(MenuCard)
      .vm.$emit("change-card", "colorCustomizer");
    await nextTick();
    expect(wrapper.findComponent({ name: "ColorCustomizer" }).exists()).toBe(
      true
    );

    // ScreenCommonSettingに戻る
    await wrapper
      .findComponent(MenuCard)
      .vm.$emit("change-card", "screenCommonSetting");
    await nextTick();
    expect(
      wrapper.findComponent({ name: "ScreenCommonSetting" }).exists()
    ).toBe(true);
  });

  it("逆方向のアニメーションが正しく設定される", async () => {
    const wrapper = mountComponent();

    // TypingScreenSettingに切り替え
    await wrapper
      .findComponent(MenuCard)
      .vm.$emit("change-card", "typingScreenSetting");
    await nextTick();
    expect((wrapper.vm as any).isReverse).toBe(false);

    // ScreenCommonSettingに戻る（逆方向）
    await wrapper
      .findComponent(MenuCard)
      .vm.$emit("change-card", "screenCommonSetting");
    await nextTick();
    expect((wrapper.vm as any).isReverse).toBe(true);
  });
});
