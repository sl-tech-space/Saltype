import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import BaseCard from "../../../../components/molecules/common/BaseCard.vue";
import Separator from "../../../../components/atoms/ui/Separator.vue";

// Separatorコンポーネントのモック
vi.mock("~/components/atoms/ui/Separator.vue", () => ({
  default: {
    name: "Separator",
    template: '<div class="separator-mock"></div>',
  },
}));

describe("BaseCard", () => {
  // 基本的なレンダリングテスト
  describe('Basic Rendering', () => {
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
          isFooter: false
        }
      });
      expect(wrapper.classes()).toContain('card--main-color');
      expect(wrapper.classes()).toContain('card-width--large');
      expect(wrapper.classes()).toContain('card-height--small');
      expect(wrapper.findAllComponents(Separator)).toHaveLength(0);
      expect(wrapper.find('.card-footer').exists()).toBe(false);
    });
  });

  // カラーバリエーションのテスト
  describe('Color Variations', () => {
    it.each(["white", "black", "main-color", "sub-color"] as const)(
      "カードカラー %s が正しく適用される",
      (color) => {
        const wrapper = mount(BaseCard, { props: { cardColor: color } });
        expect(wrapper.classes()).toContain(`card--${color}`);
      }
    );

    it.each(["white", "black", "main-color", "sub-color"] as const)(
      "セパレータカラー %s が正しく適用される",
      (color) => {
        const wrapper = mount(BaseCard, { props: { sepColor: color } });
        const separators = wrapper.findAllComponents(Separator);
        separators.forEach(sep => {
          expect(sep.attributes('color')).toBe(color);
        });
      }
    );
  });

  // サイズバリエーションのテスト
  describe('Size Variations', () => {
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
  });

  // スロットのテスト
  describe('Slot Content', () => {
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

    it("空のスロットが正しく処理される", () => {
      const wrapper = mount(BaseCard);
      expect(wrapper.find(".card-header").exists()).toBe(true);
      expect(wrapper.find(".card-body").exists()).toBe(true);
      expect(wrapper.find(".card-footer").exists()).toBe(true);
    });
  });

  // セパレータのテスト
  describe('Separator Behavior', () => {
    it('ヘッダーセパレータの表示制御が機能する', () => {
      const wrapper = mount(BaseCard, { props: { headerSep: false } });
      expect(wrapper.findAll('.separator-mock')).toHaveLength(1);
    });

    it('フッターセパレータの表示制御が機能する', () => {
      const wrapper = mount(BaseCard, { props: { footerSep: false } });
      expect(wrapper.findAll('.separator-mock')).toHaveLength(1);
    });

    it('Separatorコンポーネントが正しく設定される', () => {
      const wrapper = mount(BaseCard);
      const separators = wrapper.findAllComponents(Separator);
      separators.forEach(sep => {
        expect(sep.attributes('width')).toBe('large');
        expect(sep.attributes('margin')).toBe('none');
      });
    });
  });

  // フッター制御のテスト
  describe('Footer Control', () => {
    it("フッターが不要な場合、表示されない", () => {
      const wrapper = mount(BaseCard, { props: { isFooter: false } });
      expect(wrapper.find(".card-footer").exists()).toBe(false);
    });

    it("フッターが必要な場合、表示される", () => {
      const wrapper = mount(BaseCard, { props: { isFooter: true } });
      expect(wrapper.find(".card-footer").exists()).toBe(true);
    });
  });
});
