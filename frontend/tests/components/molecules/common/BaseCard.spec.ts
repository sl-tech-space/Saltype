import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import BaseCard from "~/components/molecules/common/BaseCard.vue";
import Separator from "~/components/atoms/ui/Separator.vue";

// Separatorコンポーネントのモック
vi.mock("~/components/atoms/ui/Separator.vue", () => ({
  default: {
    name: "Separator",
    template: '<div class="separator-mock"></div>',
  },
}));

describe("BaseCard", () => {
  it("デフォルトpropsで正しくレンダリングされる", () => {
    const wrapper = mount(BaseCard);
    expect(wrapper.find(".card").exists()).toBe(true);
    expect(wrapper.classes()).toContain("card--black");
    expect(wrapper.classes()).toContain("card-width--medium");
    expect(wrapper.classes()).toContain("card-height--medium");
    expect(wrapper.findAll(".separator-mock")).toHaveLength(2);
    expect(wrapper.find(".card-footer").exists()).toBe(true);
  });

  it('カスタムpropsで正しくレンダリングされる', () => {
    const wrapper = mount(BaseCard, {
      props: {
        cardColor: 'main-color',
        sepColor: 'white',
        width: 'large',
        height: 'small',
        headerSep: false,
        footerSep: false,
        needFooter: false
      }
    })
    expect(wrapper.classes()).toContain('card--main-color')
    expect(wrapper.classes()).toContain('card-width--large')
    expect(wrapper.classes()).toContain('card-height--small')
    expect(wrapper.findAllComponents(Separator)).toHaveLength(0)
    expect(wrapper.find('.card-footer').exists()).toBe(false)
  })

  it.each(["white", "black", "main-color", "sub-color"] as const)(
    "カードカラー %s が正しく適用される",
    (color) => {
      const wrapper = mount(BaseCard, { props: { cardColor: color } });
      expect(wrapper.classes()).toContain(`card--${color}`);
    }
  );

  it.each(["small", "medium", "large", "xl", "full"] as const)(
    "幅 %s が正しく適用される",
    (width) => {
      const wrapper = mount(BaseCard, { props: { width } });
      expect(wrapper.classes()).toContain(`card-width--${width}`);
    }
  );

  it.each(["small", "medium", "large", "xl", "full"] as const)(
    "高さ %s が正しく適用される",
    (height) => {
      const wrapper = mount(BaseCard, { props: { height } });
      expect(wrapper.classes()).toContain(`card-height--${height}`);
    }
  );

  it("スロットコンテンツが正しくレンダリングされる", () => {
    const wrapper = mount(BaseCard, {
      slots: {
        "card-header": '<div class="test-header">Header</div>',
        "card-body": '<div class="test-body">Body</div>',
        "card-footer": '<div class="test-footer">Footer</div>',
      },
    });
    expect(wrapper.find(".test-header").exists()).toBe(true);
    expect(wrapper.find(".test-body").exists()).toBe(true);
    expect(wrapper.find(".test-footer").exists()).toBe(true);
  });

  it("フッターが不要な場合、表示されない", () => {
    const wrapper = mount(BaseCard, {
      props: { needFooter: false },
    });
    expect(wrapper.find(".card-footer").exists()).toBe(false);
  });

  it('Separatorコンポーネントが正しく使用される', () => {
    const wrapper = mount(BaseCard)
    const separators = wrapper.findAllComponents(Separator)
    expect(separators).toHaveLength(2)
    expect(separators[0].attributes('color')).toBe('sub-color')
    expect(separators[0].attributes('width')).toBe('large')
    expect(separators[0].attributes('margin')).toBe('none')
  })
});
