import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DefaultLayout from "../../layouts/default.vue";
import CookieConsent from "../../components/molecules/common/ui/CookieConsent.vue";
import CustomStyles from "../../components/molecules/common/ui/CustomStyles.vue";
import CursorEffect from "../../components/molecules/common/ui/CursorEffect.vue";
import CopyRight from "../../components/atoms/ui/CopyRight.vue";

describe("DefaultLayout", () => {
  it("正しくレンダリングされること", () => {
    const wrapper = mount(DefaultLayout, {
      slots: {
        default: "<div>Test Content</div>",
      },
      shallow: true, // 子コンポーネントをスタブ化
    });

    // 必要なコンポーネントが存在することを確認
    expect(wrapper.findComponent(CustomStyles).exists()).toBe(true);
    expect(wrapper.findComponent(CookieConsent).exists()).toBe(true);
    expect(wrapper.findComponent(CursorEffect).exists()).toBe(true);
    expect(wrapper.findComponent(CopyRight).exists()).toBe(true);

    // スロットのコンテンツが正しく表示されることを確認
    expect(wrapper.html()).toContain("Test Content");

    // レイアウトのルート要素が正しいクラスを持つことを確認
    expect(wrapper.classes()).toContain("layout");
  });

  it("スロットが空の場合も正しくレンダリングされること", () => {
    const wrapper = mount(DefaultLayout, {
      shallow: true,
    });

    // 必要なコンポーネントが存在することを確認
    expect(wrapper.findComponent(CustomStyles).exists()).toBe(true);
    expect(wrapper.findComponent(CookieConsent).exists()).toBe(true);
    expect(wrapper.findComponent(CursorEffect).exists()).toBe(true);
    expect(wrapper.findComponent(CopyRight).exists()).toBe(true);

    // レイアウトの構造が正しいことを確認
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("layout");
  });
});
