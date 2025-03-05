import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import BaseHeader from "../../../../components/molecules/common/BaseHeader.vue";
import Title from "../../../../components/atoms/texts/Title.vue";
import Button from "../../../../components/atoms/buttons/Button.vue";
import Separator from "../../../../components/atoms/ui/Separator.vue";

// モックルーター
const mockRouter = {
  push: vi.fn(),
};

vi.mock("#app", () => ({
  useRouter: () => mockRouter,
}));

describe("BaseHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mountHeader = (props = {}, slots = {}) => {
    return mount(BaseHeader, {
      props,
      slots,
      global: {
        stubs: {
          Title: true,
          Button: true,
          Separator: true,
        },
      },
    });
  };

  describe('レイアウト', () => {
    it("3つのセクションが存在する", () => {
      const wrapper = mountHeader();
      expect(wrapper.find('.header-left').exists()).toBe(true);
      expect(wrapper.find('.header-center').exists()).toBe(true);
      expect(wrapper.find('.header-right').exists()).toBe(true);
    });

    it("Separatorが正しく表示される", () => {
      const wrapper = mountHeader();
      expect(wrapper.findComponent(Separator).exists()).toBe(true);
      expect(wrapper.findComponent(Separator).props()).toEqual({
        color: 'sub-color',
        width: 'large',
        margin: 'none',
        visible: true
      });
    });
  });

  describe('タイトル表示', () => {
    it("タイトルが正しく表示される", () => {
      const wrapper = mountHeader({ title: "テストタイトル" });
      const title = wrapper.findComponent(Title);
      expect(title.props("text")).toBe("テストタイトル");
      expect(title.props("size")).toBe("medium");
      expect(title.props("color")).toBe("white");
    });

    it("タイトルがない場合、スロットが使用される", () => {
      const wrapper = mountHeader({}, {
        "header-center": '<div class="test-slot">スロットコンテンツ</div>'
      });
      expect(wrapper.find(".test-slot").exists()).toBe(true);
      expect(wrapper.findComponent(Title).exists()).toBe(false);
    });
  });

  describe('戻るボタン', () => {
    it('タイトルが"ホーム"の場合、戻るボタンは表示されない', () => {
      const wrapper = mountHeader({ title: "ホーム" });
      expect(wrapper.findComponent(Button).exists()).toBe(false);
    });
  });

  describe('エッジケース', () => {
    it("タイトルが空文字の場合の処理", () => {
      const wrapper = mountHeader({ title: "" });
      expect(wrapper.findComponent(Title).exists()).toBe(true);
      expect(wrapper.findComponent(Title).props("text")).toBe("");
    });

    it("タイトルがundefinedの場合の処理", () => {
      const wrapper = mountHeader({ title: undefined });
      expect(wrapper.findComponent(Title).exists()).toBe(false);
    });

    it("タイトルがnullの場合の処理", () => {
      const wrapper = mountHeader({ title: null });
      expect(wrapper.findComponent(Title).exists()).toBe(false);
    });

    it("スロットが空の場合の処理", () => {
      const wrapper = mountHeader({}, { "header-center": "" });
      expect(wrapper.find(".header-center").exists()).toBe(true);
      expect(wrapper.find(".header-center").text()).toBe("");
    });
  });
});
