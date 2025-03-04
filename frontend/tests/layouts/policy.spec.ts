import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PolicyLayout from "../../layouts/policy.vue";
import CustomStyles from "../../components/molecules/common/ui/CustomStyles.vue";

describe("PolicyLayout", () => {
  it("正しくレンダリングされること", () => {
    const wrapper = mount(PolicyLayout, {
      slots: {
        default: "<div>Policy Content</div>",
      },
      shallow: true, // 子コンポーネントをスタブ化
    });

    // CustomStylesコンポーネントが存在することを確認
    expect(wrapper.findComponent(CustomStyles).exists()).toBe(true);

    // スロットのコンテンツが正しく表示されることを確認
    expect(wrapper.html()).toContain("Policy Content");

    // レイアウトのルート要素が正しいクラスを持つことを確認
    expect(wrapper.classes()).toContain("layout");
  });

  it("スロットが空の場合も正しくレンダリングされること", () => {
    const wrapper = mount(PolicyLayout, {
      shallow: true,
    });

    // CustomStylesコンポーネントが存在することを確認
    expect(wrapper.findComponent(CustomStyles).exists()).toBe(true);

    // レイアウトの構造が正しいことを確認
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("layout");
  });
});
